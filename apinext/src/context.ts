
import { db } from "./db";
import { token } from "./schema";
import { eq } from 'drizzle-orm';
import type { CreateWSSContextFnOptions } from "@trpc/server/adapters/ws";
import type { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";

export async function createContext(opts: CreateHTTPContextOptions | CreateWSSContextFnOptions) {
  const bearer = opts.req.headers.authorization?.split(" ")[1];

  if (!bearer) {
    return {};
  }

  const session = await db.query.token.findFirst({
    where: eq(token.id, bearer),
    with: {
      user: true,
    },
  });

  if (!session) {
    return {};
  }

  return { user: session.user, token: session.id };
}