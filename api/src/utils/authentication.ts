import { User, UserRole } from "../entities/User";
import { AuthChecker, MiddlewareFn } from "type-graphql";
import { Context } from "../utils/context";
import { AuthenticationError } from "apollo-server-core";
import { QueueEntry } from "../entities/QueueEntry";

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
  if (info.fieldName === "cars" && result[0]?.user.id !== context?.user?.id) {
    if (!result[0]?.user.id) {
      throw new Error("Unable to get user id from cars array when checking auth");
    }
    const beep = await context.em.findOne(QueueEntry, { state: { $gt: 0 }, rider: context.user.id, beeper: result[0]?.user.id });

    if (beep) {
      return result;
    }
    
    return [];
  }

  if ((["email", "phone", "location"].includes(info.fieldName) && context.user[info.fieldName as keyof User] !== result)) {
    const beep = await context.em.findOne(QueueEntry, { state: { $gt: 0 }, $or: [ { rider: context.user.id }, { beeper: context.user.id} ] });

    if (beep) {
      return result;
    } 

    return null;
  }

  return result;
};
