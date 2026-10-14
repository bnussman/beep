import * as Sentry from "@sentry/bun";
import { db } from "../services/db";
import { ORPCError } from "@orpc/server";
import { o } from "../services/orpc";
import { tokens, users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const authProviderMiddleware = o.middleware(async function provideAuth({ next, context }) {
   if (!context.rawToken) {
    return next();
  }

  // Dedupe according to https://orpc.dev/docs/recipes/dedupe-middleware
  if (context.user && context.token) {
    return next({ context: { user: context.user, token: context.token } });
  }

  const result = await db
    .select()
    .from(tokens)
    .leftJoin(users, eq(tokens.user_id, users.id))
    .where(eq(tokens.id, context.rawToken));

  const session = result[0];

  if (!session?.user) {
    return next();
  }

  Sentry.setUser(session.user);

  return next({ context: { user: session.user, token: session.token } });
});

export const authCheckerMiddleware = o.middleware(function authChecker({ next, context }) {
  if (!context.user || !context.token) {
    throw new ORPCError("UNAUTHORIZED");
  }

  return next({ context: { user: context.user, token: context.token } });
});