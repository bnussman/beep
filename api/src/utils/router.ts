import { user } from 'drizzle/schema';
import { db } from './db';
import { protectedProcedure, router } from './trpc';
import { eq } from 'drizzle-orm';
import { pubSub } from './pubsub';

export const appRouter = router({
  user: protectedProcedure.query(({ ctx }) => ctx.user),
  updateUser: protectedProcedure.mutation(({ ctx }) => {
    return db.update(user)
      .set({ first: "Banks" })
      .where(eq(user.id, ctx.user.id))
      .returning();
  }),
  userUpdates: protectedProcedure.subscription(async function* ({ ctx }) {
    const subscription = pubSub.subscribe("user", ctx.user.id);
    for await (const value of subscription) {
      yield value;
    }
  }),
});

export type AppRouter = typeof appRouter;
