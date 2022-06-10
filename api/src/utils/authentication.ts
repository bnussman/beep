import { UserRole } from "../entities/User";
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

  console.log("--------------------------------------");
  console.log(result, info);
  console.log("--------------------------------------");

  if (!context?.user) {
    return result;
  }

  if (context.user.role === UserRole.ADMIN) {
    return result;
  }

  //@ts-expect-error ill fix later
  if (["email", "phone", "location"].includes(info.fieldName) && context.user[info.fieldName] !== result) {
    // a protectd value is trying to used
    const result = await context.em.findOne(QueueEntry, { isAccepted: true, $or: [ { rider: context.user.id }, { beeper: context.user.id} ] });
    console.log("user is trying to access personal info of another user", info.fieldName)

    if (!result) {
      return null;
    }
  }

  return result;
};