import * as Sentry from "@sentry/bun";
import { StandardLazyRequest } from "@orpc/server";
import { tokens, users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
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

export {
  o,
  authedProcedure,
  verifiedProcedure,
  adminProcedure,
  mustHaveBeenInAcceptedBeep,
  mustBeInAcceptedBeep,
  withLock,
  errorInterceptor,
  otelAbortSignalCaptureInterceptor,
} from "../middleware/orpc";
