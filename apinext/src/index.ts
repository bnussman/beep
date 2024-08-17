import { authedProcedure, createContext, router } from './utils/trpc';
import { redis } from './utils/redis';
import { observable } from '@trpc/server/observable';
import { db } from './utils/db';
import { user } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import { createBunServeHandler } from 'trpc-bun-adapter';

type User = typeof user.$inferSelect;

const appRouter = router({
  me: authedProcedure.query(async ({ ctx }) => {
    return ctx.user;
  }),
  update: authedProcedure.mutation(async ({ ctx }) => {
    const u = await db.update(user).set({ location: { latitude: 5, longitude: 5 } }).where(eq(user.id, ctx.user.id)).returning();
    redis.publish(`user-${ctx.user.id}`, JSON.stringify(u[0]))
    return u[0];
  }),
  updates: authedProcedure.subscription(({ ctx }) => {
    console.log("Subscription context", ctx);
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

export type AppRouter = typeof appRouter;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

Bun.serve(
  createBunServeHandler<AppRouter>(
    {
      responseMeta() {
        return {
          status: 200,
          headers: CORS_HEADERS
        };
      },
      createContext,
      endpoint: "/trpc",
      router: appRouter,
    },
    {
      port: 3001,
    },
  )
);
