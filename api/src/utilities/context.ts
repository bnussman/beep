import { StandardLazyRequest } from "@orpc/server";
import { User } from "../types/users";
import { Token } from "../types/tokens";

export function createContext(request: StandardLazyRequest) {
  const authorizationHeader = request.headers.Authorization as string | undefined;

  if (!authorizationHeader) {
    return { rawToken: undefined };
  }

  const token = authorizationHeader.split(" ").at(1);

  if (!token) {
    return { rawToken: undefined };
  }

  return { rawToken: token };
}

export interface Context {
  rawToken: string | undefined;
  user?: User;
  token?: Token;
}

