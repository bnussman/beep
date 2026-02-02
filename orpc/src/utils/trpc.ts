import * as Sentry from "@sentry/bun";
import { db } from "./db";
import { isAcceptedBeepNew } from "../logic/beep";
import { createLock, IoredisAdapter } from "redlock-universal";
import { redis } from "./redis";
import { os, ORPCError } from "@orpc/server";

export async function createContext(
  request: Request
) {
  const bearerToken = request.headers.get("authorization")?.split(" ")[1]


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
export type AuthenticatedContext = Extract<Context, { user: {} }>;

export const o = os.$context<Context>()

export const authedProcedure = o.use(function isAuthed({ next, context }) {
  if (!context.user || !context.token) {
    throw new ORPCError("UNAUTHORIZED");
  }

  return next({ context });
});

export const verifiedProcedure = authedProcedure.use(function isVerified({ context, next }) {
  if (!context.user.isStudent || !context.user.isEmailVerified) {
    throw new ORPCError("UNAUTHORIZED", {
      message: "Your edu email must be verified.",
    });
  }

  return next({ context });
});

export const adminProcedure = authedProcedure.use(function isAdmin(opts) {
  const { context } = opts;

  if (context.user.role !== "admin") {
    throw new ORPCError("UNAUTHORIZED");
  }

  return opts.next({ context });
});

export const mustHaveBeenInAcceptedBeep = o
  .$context<AuthenticatedContext>()
  .middleware(async function checkIfUserHasBeenInAnAcceptedBeep(opts, userId: string) {
    if (!opts.context.user) {
      throw new ORPCError("UNAUTHORIZED");
    }

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
  .$context<AuthenticatedContext>()
  .middleware(async function checkIfUserIsInAnAcceptedBeep(opts, userId: string) {
    if (!opts.context.user) {
      throw new ORPCError("UNAUTHORIZED");
    }

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
  .$context<AuthenticatedContext>()
  .middleware(async function handleLock(opts) {
    if (!opts.context.user) {
      throw new Error(
        "This middleware should only be used for authenticated procedures.",
      );
    }

    const lock = createLock({
      adapter: new IoredisAdapter(redis),
      key: `${opts.path}-${opts.context.user.id}`,
      ttl: 5_000,
    });

    const handle = await lock.acquire();

    const result = await opts.next(opts);

    await lock.release(handle);

    return result;
  });


