import { UserRole } from "../entities/User";
import { AuthChecker, MiddlewareFn } from "type-graphql";
import { Context } from "../utils/context";
import { AuthenticationError } from "apollo-server-core";
import { QueueEntry } from "../entities/QueueEntry";
import * as Sentry from '@sentry/node';

export const authChecker: AuthChecker<Context> = ({ args, context }, roles) => {
  const { user } = context;

  if (!user) return false;

  // Let admins do anything
  if (user.role === UserRole.ADMIN) return true;

  if (roles[0] === 'No Verification') return true;

  if (roles[0] === 'No Verification Self') return args.id === undefined || args.id === user.id;

  if (!user.isEmailVerified) throw new AuthenticationError("Please verify your email to use the Beep App");

  if (roles.length === 0) return true;

  if (roles[0] === 'self') {
    return args.id === undefined || args.id === user.id;
  }

  if (roles[0] == context.user.role) {
    return true;
  }

  return false;
};

export const LeakChecker: MiddlewareFn<Context> = async ({ context, info }, next) => {
  const result = await next();

  // If user is not authed, just trust that auth was already handled.
  if (!context?.user) {
    return result;
  }

  // Let admins see anything
  if (context.user.role === UserRole.ADMIN) {
    return result;
  }

  // If a user is trying to get cars and the car is not their own, make sure they are in a beep with the other user.
  if (info.fieldName === "cars" && ((typeof result[0]?.user === 'object' && result[0]?.user.id !== context?.user?.id) || (typeof result[0]?.user === 'string' && result[0]?.user !== context?.user?.id))) {
    const userId = typeof result[0]?.user === 'string' ? result[0].user : result[0]?.user?.id;
    if (!userId) {
      Sentry.captureMessage("Unable to get user id from cars array when checking auth");
      throw new Error("Unable to get user id from cars array when checking auth");
    }
    const beep = await context.em.findOne(QueueEntry, { state: { $gt: 0 }, rider: context.user.id, beeper: userId });

    if (beep) {
      return result;
    }
    
    return [];
  }

  if (["email", "phone"].includes(info.fieldName)) {

    if (context.user[info.fieldName as 'email' | 'phone'] === result) {
      return result;
    }

    const beep = await context.em.findOne(QueueEntry, { state: { $gt: 0 }, $or: [ { rider: { id: context.user.id } }, { beeper: { id: context.user.id }} ] }, { populate: ['rider', 'beeper'] });

    if (beep) {
      const otherUser = beep.beeper.id === context.user.id ? beep.rider : beep.beeper;

      if (otherUser[info.fieldName as 'email' | 'phone'] === result) {
        return result;
      }

      return null;
    } 

    return null;
  }


  if (["location"].includes(info.fieldName)) {
    const beep = await context.em.findOne(QueueEntry, { state: { $gt: 0 }, $or: [ { rider: { id: context.user.id } }, { beeper: { id: context.user.id }} ] }, { populate: ['rider', 'beeper'] });

    if (beep) {
      const otherUser = beep.beeper.id === context.user.id ? beep.rider : beep.beeper;

      if (otherUser.location?.latitude === result.latitude && otherUser.location?.longitude === result.longitude) {
        return result;
      }

      return null;
    }

    return null;
  }


  return result;
};
