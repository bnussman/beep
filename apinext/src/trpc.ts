import { initTRPC } from '@trpc/server';
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
 
/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.create();
 
/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;


export function createContext({
  req,
  resHeaders,
}: FetchCreateContextFnOptions) {
  const token = req.headers.get('authorization');
  const user = { name: "Banks", token };
  return { req, resHeaders, user };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
