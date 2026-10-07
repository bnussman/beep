import { os, ORPCError, StandardLazyRequest } from "@orpc/server";
import { DrizzleQueryError } from "drizzle-orm";
import { User } from "../types/users";
import { Token } from "../types/tokens";

export function getTokenFromRequest(request: Request) {
  return request.headers.get("authorization")?.split(" ")[1]
}

export function getTokenFromWSRequest(request: StandardLazyRequest) {
  return (request.headers.Authorization as string | undefined)?.split(" ")[1]
}

export interface Context {
  rawToken: string | undefined;
  user?: User;
  token?: Token;
}

const errorTransformerMiddleware = os.middleware(async function errorTransformer(opts) {
  try {
    return await opts.next(opts);
  } catch (error) {
    // Return a human readable error message for PostgreSQL duplicate key errors
    if (
      error instanceof DrizzleQueryError &&
      error.cause &&
      'code' in error.cause &&
      'detail' in error.cause &&
      typeof error.cause.detail === 'string' &&
      error.cause.code === "23505"
    ) {
      throw new ORPCError("CONFLICT", { message: error.cause.detail });
    }

    throw error;
  }
});

export const o = os.$context<Context>().use(errorTransformerMiddleware);
