import * as Sentry from "@sentry/bun";
import { db } from "../services/db";
import { isAcceptedBeepNew } from "../logic/beeps";
import { createLock, NodeRedisAdapter } from "redlock-universal";
import { redis } from "../services/redis";
import { ORPCError, onError } from "@orpc/server";
import { StandardHandlerInterceptor } from "@orpc/server/standard";
import { o, type Context } from "../services/orpc";
import { tokens, users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

const authProviderMiddleware = o.middleware(async function provideAuth({ next, context }) {
   if (!context.rawToken) {
    return next();
  }

  // Dedupe according to https://orpc.dev/docs/recipes/dedupe-middleware
  if (context.user && context.token) {
    return next({ context: { user: context.user, token: context.token } });
  }

  const result = await db
    .select()
    .from(tokens)
    .leftJoin(users, eq(tokens.user_id, users.id))
    .where(eq(tokens.id, context.rawToken));

  const session = result[0];

  if (!session?.user) {
    return next();
  }

  Sentry.setUser(session.user);

  return next({ context: { user: session.user, token: session.token } });
});

const authCheckerMiddleware = o.middleware(async function authChecker({ next, context }) {
  if (!context.user || !context.token) {
    throw new ORPCError("UNAUTHORIZED");
  }

  return next({ context: { user: context.user, token: context.token } });
});

const isVerifiedMiddleware = o
  .use(authCheckerMiddleware)
  .middleware(function isVerified({ context, next }) {
    if (!context.user.isStudent || !context.user.isEmailVerified) {
      throw new ORPCError("FORBIDDEN", {
        message: "Your edu email must be verified.",
      });
    }

    return next({ context });
  });

const isAdminMiddleware = o
  .use(authCheckerMiddleware)
  .middleware(function isAdmin(opts) {
    const { context } = opts;

    if (context.user.role !== "admin") {
      throw new ORPCError("UNAUTHORIZED");
    }

    return opts.next({ context });
  });

export const authedProcedure = o
  .use(authProviderMiddleware)
  .use(authCheckerMiddleware);

export const verifiedProcedure = o
  .use(authProviderMiddleware)
  .use(authCheckerMiddleware)
  .use(isVerifiedMiddleware);

export const adminProcedure = o.use(authProviderMiddleware)
  .use(authCheckerMiddleware)
  .use(isAdminMiddleware);

export const mustHaveBeenInAcceptedBeep = o
  .use(authCheckerMiddleware)
  .middleware(async function checkIfUserHasBeenInAnAcceptedBeep(opts, userId: string) {
    if (opts.context.user.role === "admin" || userId === opts.context.user.id) {
      return opts.next(opts);
    }

    const acceptedOrCompleteBeep = await db.query.beeps.findFirst({
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
  .use(authCheckerMiddleware)
  .middleware(async function checkIfUserIsInAnAcceptedBeep(opts, userId: string) {
    if (opts.context.user.role === "admin" || userId === opts.context.user.id) {
      return opts.next(opts);
    }

    const acceptedBeep = await db.query.beeps.findFirst({
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
  .use(authCheckerMiddleware)
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
  const isORPCError = error instanceof ORPCError;

  if (!isORPCError) {
    console.error(error);
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