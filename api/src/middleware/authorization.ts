import { db } from "../services/db";
import { isAcceptedBeepNew } from "../logic/beeps";
import { ORPCError } from "@orpc/server";
import { o } from "../services/orpc";
import { authCheckerMiddleware } from "./authentication";

export const isVerifiedMiddleware = o
  .use(authCheckerMiddleware)
  .middleware(function isVerified({ context, next }) {
    if (!context.user.isStudent || !context.user.isEmailVerified) {
      throw new ORPCError("FORBIDDEN", {
        message: "Your edu email must be verified.",
      });
    }

    return next({ context });
  });

export const isAdminMiddleware = o
  .use(authCheckerMiddleware)
  .middleware(function isAdmin({ context, next }) {
    if (context.user.role !== "admin") {
      throw new ORPCError("FORBIDDEN");
    }

    return next({ context });
  });

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