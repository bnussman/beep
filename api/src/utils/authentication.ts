import { UserRole } from "../entities/User";
import { AuthChecker } from "type-graphql";
import { Context } from "../utils/context";
import { AuthenticationError } from "apollo-server-core";
import { QueueEntry } from "../entities/QueueEntry";

export enum AuthScopes {
  ADMIN,
  VERIFIED,
  SELF,
  RIDING
}

export const authChecker: AuthChecker<Context, AuthScopes> = async ({ args, context, info }, roles) => {
  const { user } = context;

  if (info.operation.name?.value === "SignUp") {
    return true;
  }
  if (info.operation.name?.value === "Login") {
    return true;
  }

  // If there is no user in the context, they are not authenticated
  if (!user) return false;

  // If no auth scopes are passed, and the user is authed,
  // let them do whatever
  if (roles.length === 0) return true;

  // Let Admins do anything
  if (roles.includes(AuthScopes.ADMIN)) {
    return user.role === UserRole.ADMIN;
  }

  if (roles.includes(AuthScopes.VERIFIED) && !user.isEmailVerified) {
    throw new AuthenticationError("Please verify your email to use the Beep App");
  }

  if (roles.includes(AuthScopes.SELF)) {
    return !args.id || args.id === user.id;
  }

  if (roles.includes(AuthScopes.RIDING)) {
    const entry = await context.em.findOne(QueueEntry, { $or: [{ rider: context.user.id }, { beeper: context.user.id }] });

    if (!entry) {
      throw new AuthenticationError("You must be participating in a beep to get this data.");
    }
  }

  return true;
};
