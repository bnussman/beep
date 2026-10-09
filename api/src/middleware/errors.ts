import * as Sentry from "@sentry/bun";
import { onError, ORPCError, os } from "@orpc/server";
import { StandardHandlerInterceptor } from "@orpc/server/standard";
import { DrizzleQueryError } from "drizzle-orm";
import { Context } from "../utilities/context";

export const errorTransformerMiddleware = os.middleware(async function errorTransformer(opts) {
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

export const errorInterceptor: StandardHandlerInterceptor<Context> = onError((error) => {
  const isORPCError = error instanceof ORPCError;

  if (!isORPCError) {
    console.error(error);
    Sentry.captureException(error);
  }
});