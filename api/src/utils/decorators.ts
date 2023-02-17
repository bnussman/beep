import { User } from "../entities/User";
import { MiddlewareFn } from "type-graphql";
import { Context } from "./context";

export const MustBeInAcceptedBeep: MiddlewareFn<Context> = async ({ context, info, root }, next) => {
  const user = root as User;

  console.log(info.fieldName, root);

  // User is getting their own information, so just resolve
  if (user.id === context.user.id) {
    return await next();
  }

  

  return await next();
};