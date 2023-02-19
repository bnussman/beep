import * as Sentry from '@sentry/node';
import { Beep, Status } from "../entities/Beep";
import { QueryOrder } from "@mikro-orm/core";
import { User, UserRole } from "../entities/User";
import { MiddlewareFn } from "type-graphql";
import { Context } from "./context";

export const MustBeInAcceptedBeep: MiddlewareFn<Context> = async ({ context, info, root }, next) => {
  if (info.parentType.name !== "User") {
    Sentry.captureException("MustBeInAcceptedBeep middleware was used on a non-user entity");
    throw new Error("You can only use this middleware with the the User entity");
  }

  // unauthenticated request so just trust that authorization was handled by our main auth checker
  if (!context.user) {
    return await next();
  }

  // If the requesting user is an admin, let them see the value no matter what
  if (context.user.role === UserRole.ADMIN) {
    return await next();
  }

  const user = root as User;

  // User is getting their own information, so just resolve
  if (user.id === context.user.id) {
    return await next();
  }

  const beep = await context.em.findOne(
    Beep,
    {
      $or: [
        { rider: { id: context.user.id } },
        { beeper: { id: context.user.id } }
      ],
      $and: [
        { status: { $ne: Status.DENIED } },
        { status: { $ne: Status.COMPLETE } },
        { status: { $ne: Status.CANCELED } },
        { status: { $ne: Status.WAITING } },
      ]
    },
    {
      orderBy: { start: QueryOrder.DESC }
    }
  );

  if (!beep) {
    // console.log(`${context.user.name()} did NOT have permission to see ${user.first}'s ${info.fieldName}`)
    return null;
  }

  // console.log(`${context.user.name()} had permission to see ${user.first}'s ${info.fieldName}`)

  return await next();
};