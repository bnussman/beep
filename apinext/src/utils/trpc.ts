import { TRPCError, initTRPC } from '@trpc/server';
import { db } from './db';
import { token } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { CreateHTTPContextOptions } from '@trpc/server/adapters/standalone';
import { CreateWSSContextFnOptions } from '@trpc/server/adapters/ws';
 
/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<Context>().create();
 
/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;

export const authedProcedure = t.procedure.use(async function isAuthed(opts) {
  const { ctx } = opts;

  if (!ctx.user || !ctx.token) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return opts.next({ ctx });
});

export async function createContext(data: CreateHTTPContextOptions | CreateWSSContextFnOptions) {
  const bearerToken = data.req?.headers.authorization?.split(' ')[1] ?? data.info?.connectionParams?.token;

  console.log("Context Data", data.req.url, data?.info?.connectionParams)

  if (!bearerToken) {
    return {};
  }

  const session = await db.query.token.findFirst({
    where: eq(token.id, bearerToken),
    with: { user: true }
  })

  if (!session) {
    return {};
  }

  return { user: session.user, token: session };
}

export type Context = Awaited<ReturnType<typeof createContext>>;