import { z } from "zod";
import { adminProcedure, router } from "../utils/trpc";
import { db } from "../utils/db";
import { count, desc } from "drizzle-orm";
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
    })
});
