import { observable } from "@trpc/server/observable";
import { authedProcedure, router } from "../utils/trpc";
import { user } from '../../drizzle/schema';
import { redis } from "../utils/redis";
import { db } from "../utils/db";
import { eq } from "drizzle-orm";

type User = typeof user.$inferSelect;

export const userRouter = router({
  me: authedProcedure.query(async ({ ctx }) => {
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
})
