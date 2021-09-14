import { UserRole } from "../entities/User";
import { AuthChecker } from "type-graphql";
import { Context } from "../utils/context";
import { AuthenticationError } from "apollo-server-core";

export const authChecker: AuthChecker<Context> = ({ args, context }, roles) => {
    const { user } = context;

    if (!user) return false;

    if (!user.isEmailVerified) throw new AuthenticationError("Please verify your email to use the Beep App");

    if (roles.length === 0) return true;

    if (roles[0] === 'self') {
        return args.id === user.id || user.role === UserRole.ADMIN;
    }

    if (roles[0] == context.user.role) {
        return true;
    }

    return false;
};
