import { z } from "zod";
import { adminProcedure, authedProcedure } from "../utils/trpc";
import { db } from "../utils/db";
import { count, eq } from "drizzle-orm";
import { feedback } from "../../drizzle/schema";
import { DEFAULT_PAGE_SIZE } from "../utils/constants";

export const feedbackRouter = {
  feedback: adminProcedure
    .input(
      z.object({
        page: z.number().default(1),
        pageSize: z.number().default(DEFAULT_PAGE_SIZE),
      }),
    )
    .handler(async ({ input }) => {
      const [feedbacks, countData] = await Promise.all([
        db.query.feedback.findMany({
          orderBy: { created: "desc" },
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
        }),
        db.select({ count: count() }).from(feedback),
      ]);

      const results = countData[0].count;

      return {
        feedback: feedbacks,
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
    .handler(async ({ context, input }) => {
      const f = await db
        .insert(feedback)
        .values({
          id: crypto.randomUUID(),
          user_id: context.user.id,
          message: input.message,
          created: new Date(),
        })
        .returning();

      return f[0];
    }),
  deleteFeedback: adminProcedure
    .input(z.string())
    .handler(async ({ input }) => {
      await db.delete(feedback).where(eq(feedback.id, input));
    }),
};
