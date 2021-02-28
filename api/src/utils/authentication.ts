import { AuthChecker } from "type-graphql";
import { Context } from "../utils/context";

export const authChecker: AuthChecker<Context> = ({ context }, roles) => {
    const user = context.user;
    if (!user) return false;
    console.log("Checking auth");
    if (roles.length === 0) {
      // if `@Authorized()`, check only if user exists
      return user != null;
    }
    // there are some roles defined now
  
    if (!user) {
      // and if no user, restrict access
      return false;
    }

    if (roles[0] == user.role) {
      // grant access if the role matches specified
      return true;
    }

    return false;
  };
