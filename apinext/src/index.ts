import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { authedProcedure, createContext, publicProcedure, router } from './trpc';
import { db } from './db';
import { eq } from 'drizzle-orm';
import { user } from '../drizzle/schema';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const appRouter = router({
  me: authedProcedure.query(async ({ ctx }) => {
    console.log("got authed")
    await db.update(user).set({ location: { latitude: 2, longitude: 3 } }).where(eq(user.id, ctx.user!.id))
    return ctx.user;
  })
});

Bun.serve({
  port: 3001,
  fetch(req) {
    if (req.method === 'OPTIONS') {
      return new Response('Departed', { headers: CORS_HEADERS });
    }
    return fetchRequestHandler({
      endpoint: '/trpc',
      router: appRouter,
      req,
      onError: console.error,
      responseMeta: () => ({
        headers: CORS_HEADERS,
      }),
      createContext
    });
  },
});

export type AppRouter = typeof appRouter;
