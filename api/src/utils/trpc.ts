import * as Sentry from "@sentry/bun";
import { ORPCError, os } from '@orpc/server'
import { db } from "./db";
import { isAcceptedBeepNew } from "../logic/beep";
import { createLock, IoredisAdapter } from "redlock-universal";
import { redis } from "./redis";

export async function createContext(request: Request) {
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

export const o = os.$context<Awaited<ReturnType<typeof createContext>>>()

export const authedProcedure = o.use(function isAuthed(opts) {
  const { context, next } = opts;

  if (!context.user || !context.token) {
    throw new ORPCError("UNAUTHORIZED");
  }

  return next({ context });
});

export const verifiedProcedure = authedProcedure.use(function isVerified(opts) {
  const { context } = opts;

  if (!context.user.isStudent || !context.user.isEmailVerified) {
    throw new ORPCError(
      "UNAUTHORIZED", {
      message: "Your edu email must be verified.",
    });
  }

  return opts.next({ context });
});

export const adminProcedure = authedProcedure.use(function isAdmin(opts) {
  if (opts.context.user.role !== "admin") {
    throw new ORPCError("UNAUTHORIZED");
  }

  return opts.next({ context: opts.context });
});

export const mustHaveBeenInAcceptedBeep = o
  .middleware(async function checkIfUserHasBeenInAnAcceptedBeep(opts, input: string) {
    if (!opts.context.user) {
      throw new ORPCError("UNAUTHORIZED");
    }

    if (opts.context.user.role === "admin" || input === opts.context.user.id) {
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
                  { beeper_id: input },
                ],
              },
              {
                AND: [
                  { rider_id: input },
                  { beeper_id: opts.context.user.id },
                ],
              },
            ],
          },
        ],
      },
    });

    if (!acceptedOrCompleteBeep) {
      throw new ORPCError(
        "FORBIDDEN", {
        message:
          "You be in an accepted beep with that user or have completed a beep with them in the past to perform this action.",
      });
    }

    return opts.next(opts);
  });

export const mustBeInAcceptedBeep = o
  .middleware(async function checkIfUserIsInAnAcceptedBeep(opts, input: string) {
    if (!opts.context.user) {
      throw new ORPCError("UNAUTHORIZED");
    }

    if (opts.context.user.role === "admin" || input === opts.context.user.id) {
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
                  { beeper_id: input },
                ],
              },
              {
                AND: [
                  { rider_id: input },
                  { beeper_id: opts.context.user.id },
                ],
              },
            ],
          },
        ],
      },
    });

    if (!acceptedBeep) {
      throw new ORPCError(
         "FORBIDDEN", {
        message:
          "You must be in an accepted beep with the user to perform this action.",
      });
    }

    return opts.next(opts);
  });

export const withLock = o.middleware(async function handleLock(opts) {
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

