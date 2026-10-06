import * as Sentry from "@sentry/bun";
import { os, ORPCError, StandardLazyRequest } from "@orpc/server";
import { tokens, users } from "../../drizzle/schema";
import { DrizzleQueryError, eq } from "drizzle-orm";
import { db } from "./db";

async function createContext(bearerToken: string | undefined) {
  if (!bearerToken) {
    return {};
  }

  const result = await db
    .select()
    .from(tokens)
    .leftJoin(users, eq(tokens.user_id, users.id))
    .where(eq(tokens.id, bearerToken));

  const session = result[0];

  if (!session?.user) {
    return {};
  }

  Sentry.setUser(session.user);

  return { user: session.user, token: session.token };
}

export async function createHTTPContext(request: Request) {
  const bearerToken = request.headers.get("authorization")?.split(" ")[1]

  return await createContext(bearerToken);
}

export async function createWSContext(request: StandardLazyRequest) {
  const bearerToken = (request.headers.Authorization as string | undefined)?.split(" ")[1]

  return await createContext(bearerToken)
}

export type Context = Awaited<ReturnType<typeof createContext>>;

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
