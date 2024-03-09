
import { db } from "./db";
import { token } from "./schema";
import { eq } from 'drizzle-orm';
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'

export async function createContext(opts: FetchCreateContextFnOptions) {
  const bearer = opts.req.headers.get("authorization")?.split(" ")[1];

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