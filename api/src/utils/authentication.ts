import { UserRole } from "../entities/User";
import { AuthChecker } from "type-graphql";
import { Context } from "../utils/context";

export const authChecker: AuthChecker<Context> = ({ args, context }, roles) => {
  if (!context.user) return false;

  if (roles.length === 0) {
    // if `@Authorized()`, check only if user exists
    return context.user != null;
  }

  // User can only perform Query or Mutation on themselves
  if (roles[0] === 'self') {
    return args.id === context.user.id || context.user.role === UserRole.ADMIN;
  }

  if (roles[0] == context.user.role) {
    // grant access if the role matches specified
    return true;
  }

  return false;
};