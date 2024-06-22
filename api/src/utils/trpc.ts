import { TRPCError, initTRPC } from '@trpc/server';
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { db } from './db';
import { token } from 'drizzle/schema';
import { eq } from 'drizzle-orm';
 
/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<Context>().create();

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

export type Context = Awaited<ReturnType<typeof createContext>>;
 
/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async function isAuthed(
  opts,
) {
  const { ctx } = opts;
  if (!ctx.user || !ctx.token) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return opts.next({
    ctx: {
      user: ctx.user,
      token: ctx.token
    },
  });
});
