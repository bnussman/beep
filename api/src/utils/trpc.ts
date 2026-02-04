import * as Sentry from "@sentry/bun";
import { TRPCError, inferRouterInputs, initTRPC } from "@trpc/server";
import z, { ZodError } from "zod";
import { AppRouter } from "..";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { db } from "./db";
import { isAcceptedBeepNew } from "../logic/beep";
import { createLock, IoredisAdapter } from "redlock-universal";
import { redis } from "./redis";

function getErrorData(error: TRPCError) {
  return {
    fieldErrors: error.code === "BAD_REQUEST" && error.cause instanceof ZodError
      ? (z.flattenError(error.cause).fieldErrors as Record<
        string,
        string[]
      >)
      : undefined
  }
}

const t = initTRPC.context<Context>().create({
  errorFormatter(opts) {
    const { shape, error } = opts;

    return {
      ...shape,
      data: {
        ...shape.data,
        ...getErrorData(error),
      },
    };
  },
});

export type RouterInput = inferRouterInputs<AppRouter>;

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;

const sentryMiddleware = t.middleware((opts) => {
  Sentry.getCurrentScope().setTransactionName(`${opts.type} ${opts.path}`);
  const activeSpan = Sentry.getActiveSpan();
  if (activeSpan) {
    Sentry.updateSpanName(activeSpan, `${opts.type} ${opts.path}`);
  }

  return opts.next();
});

export const publicProcedure = t.procedure.use(sentryMiddleware);

export const authedProcedure = publicProcedure.use(function isAuthed(opts) {
  const { ctx } = opts;

  if (!ctx.user || !ctx.token) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return opts.next({ ctx });
});

export const verifiedProcedure = authedProcedure.use(function isVerified(opts) {
  const { ctx } = opts;

  if (!ctx.user.isStudent || !ctx.user.isEmailVerified) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Your edu email must be verified.",
    });
  }

  return opts.next({ ctx });
});

export const adminProcedure = authedProcedure.use(function isAdmin(opts) {
  const { ctx } = opts;

  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return opts.next({ ctx });
});

export const mustHaveBeenInAcceptedBeep = t.procedure
  .input(z.string())
  .use(async function checkIfUserHasBeenInAnAcceptedBeep(opts) {
    if (!opts.ctx.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    if (opts.ctx.user.role === "admin" || opts.input === opts.ctx.user.id) {
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
                  { rider_id: opts.ctx.user.id },
                  { beeper_id: opts.input },
                ],
              },
              {
                AND: [
                  { rider_id: opts.input },
                  { beeper_id: opts.ctx.user.id },
                ],
              },
            ],
          },
        ],
      },
    });

    if (!acceptedOrCompleteBeep) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message:
          "You must be in an accepted beep with that user or have completed a beep with them in the past to perform this action.",
      });
    }

    return opts.next(opts);
  });

export const mustBeInAcceptedBeep = t.procedure
  .input(z.string())
  .use(async function checkIfUserIsInAnAcceptedBeep(opts) {
    if (!opts.ctx.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    if (opts.ctx.user.role === "admin" || opts.input === opts.ctx.user.id) {
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
                  { rider_id: opts.ctx.user.id },
                  { beeper_id: opts.input },
                ],
              },
              {
                AND: [
                  { rider_id: opts.input },
                  { beeper_id: opts.ctx.user.id },
                ],
              },
            ],
          },
        ],
      },
    });

    if (!acceptedBeep) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message:
          "You must be in an accepted beep with the user to perform this action.",
      });
    }

    return opts.next(opts);
  });

export const withLock = t.middleware(async function handleLock(opts) {
  if (!opts.ctx.user) {
    throw new Error(
      "This middleware should only be used for authenticated procedures.",
    );
  }

  const lock = createLock({
    adapter: new IoredisAdapter(redis),
    key: `${opts.path}-${opts.ctx.user.id}`,
    ttl: 5_000,
  });

  const handle = await lock.acquire();

  const result = await opts.next({ ctx: opts.ctx });

  await lock.release(handle);

  return result;
});

export async function createContext(
  data: Omit<FetchCreateContextFnOptions, "resHeaders">,
) {
  const bearerToken =
    data.req?.headers.get("authorization")?.split(" ")[1] ??
    data.info?.connectionParams?.token;

  if (!bearerToken) {
    return {};
  }

  const session = await db.query.token.findFirst({
    where: { id: bearerToken },
    with: {
      user: {
        columns: {
          password: false,
          passwordType: false,
        },
      },
    },
  });

  if (!session) {
    return {};
  }

  Sentry.setUser(session.user);

  return { user: session.user, token: session };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
