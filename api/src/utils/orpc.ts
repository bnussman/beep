import * as Sentry from "@sentry/bun";
import { db } from "./db";
import { isAcceptedBeepNew } from "../logic/beep";
import { createLock, NodeRedisAdapter } from "redlock-universal";
import { redis } from "./redis";
import { os, ORPCError, onError } from "@orpc/server";
import { token, user } from "../../drizzle/schema";
import { DrizzleQueryError, eq } from "drizzle-orm";
import { StandardHandlerInterceptor, StandardLazyRequest } from "@orpc/server/standard";

async function createContext(bearerToken: string | undefined) {
  if (!bearerToken) {
    return {};
  }

  const result = await db
    .select()
    .from(token)
    .leftJoin(user, eq(token.user_id, user.id))
    .where(eq(token.id, bearerToken));

  const session = result[0];

  if (!session?.user) {
    return {};
  }

  Sentry.setUser(session.user);

  return { user: session.user, token: session.token };
}

export async function createHTTPContext(request: Request) {
  const bearerToken = request.headers.get("authorization")?.split(" ")[1]

  return await createContext(bearerToken);
}

export async function createWSContext(request: StandardLazyRequest) {
  const bearerToken = (request.headers.Authorization as string | undefined)?.split(" ")[1]

  return await createContext(bearerToken)
}

export type Context = Awaited<ReturnType<typeof createContext>>;

const errorTransformerMiddleware = os.middleware(async function errorTransformer(opts) {
  try {
    return await opts.next(opts);
  } catch (error) {
    // Return a human readable error message for PostgreSQL duplicate key errors
    if (
      error instanceof DrizzleQueryError &&
      error.cause &&
      'code' in error.cause &&
      'detail' in error.cause &&
      typeof error.cause.detail === 'string' &&
      error.cause.code === "23505"
    ) {
      throw new ORPCError("CONFLICT", { message: error.cause.detail });
    }

    throw error;
  }
});

export const o = os.$context<Context>().use(errorTransformerMiddleware);

const isAuthenticatedMiddleware = o.middleware(function isAuthed({ next, context }) {
  if (!context.user || !context.token) {
    throw new ORPCError("UNAUTHORIZED");
  }

  return next({ context });
});

const isVerifiedMiddleware = o
  .use(isAuthenticatedMiddleware)
  .middleware(function isVerified({ context, next }) {
    if (!context.user.isStudent || !context.user.isEmailVerified) {
      throw new ORPCError("UNAUTHORIZED", {
        message: "Your edu email must be verified.",
      });
    }

    return next({ context });
  });

const isAdminMiddleware = o
  .use(isAuthenticatedMiddleware)
  .middleware(function isAdmin(opts) {
    const { context } = opts;

    if (context.user.role !== "admin") {
      throw new ORPCError("UNAUTHORIZED");
    }

    return opts.next({ context });
  });

export const authedProcedure = o.use(isAuthenticatedMiddleware);
export const verifiedProcedure = o.use(isVerifiedMiddleware);
export const adminProcedure = o.use(isAdminMiddleware);

export const mustHaveBeenInAcceptedBeep = o
  .use(isAuthenticatedMiddleware)
  .middleware(async function checkIfUserHasBeenInAnAcceptedBeep(opts, userId: string) {
    if (opts.context.user.role === "admin" || userId === opts.context.user.id) {
      return opts.next(opts);
    }

    const acceptedOrCompleteBeep = await db.query.beep.findFirst({
      where: {
        AND: [
          { OR: [isAcceptedBeepNew, { status: "complete" }] },
          {
            OR: [
              {
                AND: [
                  { rider_id: opts.context.user.id },
                  { beeper_id: userId },
                ],
              },
              {
                AND: [
                  { rider_id: userId },
                  { beeper_id: opts.context.user.id },
                ],
              },
            ],
          },
        ],
      },
    });

    if (!acceptedOrCompleteBeep) {
      throw new ORPCError("FORBIDDEN", {
        message:
          "You be in an accepted beep with that user or have completed a beep with them in the past to perform this action.",
      });
    }

    return opts.next(opts);
  });

export const mustBeInAcceptedBeep = o
  .use(isAuthenticatedMiddleware)
  .middleware(async function checkIfUserIsInAnAcceptedBeep(opts, userId: string) {
    if (opts.context.user.role === "admin" || userId === opts.context.user.id) {
      return opts.next(opts);
    }

    const acceptedBeep = await db.query.beep.findFirst({
      where: {
        AND: [
          isAcceptedBeepNew,
          {
            OR: [
              {
                AND: [
                  { rider_id: opts.context.user.id },
                  { beeper_id: userId },
                ],
              },
              {
                AND: [
                  { rider_id: userId },
                  { beeper_id: opts.context.user.id },
                ],
              },
            ],
          },
        ],
      },
    });

    if (!acceptedBeep) {
      throw new ORPCError("FORBIDDEN", {
        message:
          "You must be in an accepted beep with the user to perform this action.",
      });
    }

    return opts.next(opts);
  });

export const withLock = o
  .use(isAuthenticatedMiddleware)
  .middleware(async function handleLock(opts) {
    const lock = createLock({
      adapter: new NodeRedisAdapter(redis),
      key: `${opts.path}-${opts.context.user.id}`,
      ttl: 5_000,
    });

    const handle = await lock.acquire();

    const result = await opts.next(opts);

    await lock.release(handle);

    return result;
  });

export const errorInterceptor: StandardHandlerInterceptor<Context> = onError((error) => {
  if (!(error instanceof ORPCError)) {
    console.error("Banks", error);
    Sentry.captureException(error);
  }
});

export const otelAbortSignalCaptureInterceptor: StandardHandlerInterceptor<Context> = ({ request, next }) => {
  const span = Sentry.getActiveSpan();

  request.signal?.addEventListener('abort', () => {
    span?.addEvent('aborted', { reason: String(request.signal?.reason) })
  })

  return next()
};