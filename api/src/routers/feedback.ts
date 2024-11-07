import { z } from "zod";
import { adminProcedure, authedProcedure, router } from "../utils/trpc";
import { db } from "../utils/db";
import { count, desc, eq } from "drizzle-orm";
import { feedback } from "../../drizzle/schema";

export const feedbackRouter = router({
  feedback: adminProcedure
    .input(
      z.object({
        offset: z.number(),
        limit: z.number()
      })
    )
    .query(async ({ input }) => {
      const feedbackItems = await db.query.feedback.findMany({
        orderBy: desc(feedback.created),
        offset: input.offset,
        limit: input.limit,
        with: {
          user: {
            columns: {
              id: true,
              first: true,
              last: true,
              photo: true,
            }
          }
        },
      });

      const feedbackCount = await db.select({ count: count() }).from(feedback);

      return {
        feedback: feedbackItems,
        count: feedbackCount[0].count
      };
    }),
  createFeedback: authedProcedure
    .input(
      z.object({
        message: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const f = await db
        .insert(feedback)
        .values({
          id: crypto.randomUUID(),
          user_id: ctx.user.id,
          message: input.message,
          created: new Date()
        })
        .returning();

      return f[0];
    }),
  deleteFeedback: adminProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      await db.delete(feedback)
        .where(eq(feedback.id, input))
    })
});
