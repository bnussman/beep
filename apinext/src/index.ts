import { authedProcedure, createContext, publicProcedure, router } from './utils/trpc';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { redis } from './utils/redis';
import { observable } from '@trpc/server/observable';
import { db } from './utils/db';
import { user } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

type User = typeof user.$inferSelect;

const appRouter = router({
  me: publicProcedure.query(async ({ ctx }) => {
    return ctx.user;
  }),
  update: authedProcedure.mutation(async ({ ctx }) => {
    const u = await db.update(user).set({ location: { latitude: 5, longitude: 5 } }).where(eq(user.id, ctx.user.id)).returning();
    redis.publish(`user-${ctx.user.id}`, JSON.stringify(u[0]))
    return u[0];
  }),
  updates: authedProcedure.subscription(({ ctx }) => {
    // return an `observable` with a callback which is triggered immediately
    return observable<User>((emit) => {
      const onUserUpdate = (data: string) => {
        // emit data to client
        emit.next(JSON.parse(data));
      };
      // trigger `onAdd()` when `add` is triggered in our event emitter
      redis.subscribe(`user-${ctx.user.id}`);
      redis.on("message", onUserUpdate);
      (() => emit.next(ctx.user))();
      // unsubscribe function when client disconnects or stops subscribing
      return () => {
        redis.off("message", onUserUpdate);
        redis.unsubscribe(`user-${ctx.user.id}`);
      };
    });
  }),
});

// const server = createHTTPServer({
//   middleware: cors(),
//   router: appRouter,
//   createContext,
// })

// const wss = new ws.Server({
//   server,
//   path: '/ws'
// });

// const handler = applyWSSHandler({
//   wss,
//   router: appRouter,
//   createContext,
// });

// server.listen(3001);

export type AppRouter = typeof appRouter;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

Bun.serve({
  port: 3001,
  fetch(request, server) {
    if (request.method === "OPTIONS") {
      return new Response("All good!", { headers: CORS_HEADERS });
    }
    return fetchRequestHandler({
      onError: console.error,
      endpoint: '/trpc',
      req: request,
      router: appRouter,
      responseMeta(opts) {
        return { headers: CORS_HEADERS }
      },
      createContext,
    });
  }
})
