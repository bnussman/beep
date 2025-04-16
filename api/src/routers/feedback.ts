import { z } from "zod";
import { adminProcedure, authedProcedure, router } from "../utils/trpc";
import { db } from "../utils/db";
import { count, desc, eq } from "drizzle-orm";
import { feedback } from "../../drizzle/schema";
import { DEFAULT_PAGE_SIZE } from "../utils/constants";

export const feedbackRouter = router({
  feedback: adminProcedure
    .input(
      z.object({
        page: z.number().default(1),
        pageSize: z.number().default(DEFAULT_PAGE_SIZE),
      }),
    )
    .query(async ({ input }) => {
      const feedbackItems = await db.query.feedback.findMany({
        orderBy: desc(feedback.created),
        offset: (input.page - 1) * input.pageSize,
        limit: input.pageSize,
        with: {
          user: {
            columns: {
              id: true,
              first: true,
              last: true,
              photo: true,
            },
          },
        },
      });

      const feedbackCount = await db.select({ count: count() }).from(feedback);
      const results = feedbackCount[0].count;

      return {
        feedback: feedbackItems,
        page: input.page,
        pageSize: input.pageSize,
        pages: Math.ceil(results / input.pageSize),
        results,
      };
    }),
  createFeedback: authedProcedure
    .input(
      z.object({
        message: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const f = await db
        .insert(feedback)
        .values({
          id: crypto.randomUUID(),
          user_id: ctx.user.id,
          message: input.message,
          created: new Date(),
        })
        .returning();

      return f[0];
    }),
  deleteFeedback: adminProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      await db.delete(feedback).where(eq(feedback.id, input));
    }),
});
