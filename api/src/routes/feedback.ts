import { z } from "zod";
import { adminProcedure, authedProcedure } from "../middleware/orpc";
import { db } from "../services/db";
import { eq } from "drizzle-orm";
import { feedbacks } from "../../drizzle/schema";
import { condensedUserColumns } from "../logic/users";
import { createFeedbackInputSchema } from "../schemas/feedback";
import { getFeedbacksCount } from "../logic/feedback";
import { getOffsetFromPage, getPagesFromCount, paginationSchema } from "../utilities/pagination";

export const feedbackRouter = {
  feedback: adminProcedure
    .input(paginationSchema)
    .handler(async ({ input }) => {
      const [feedbacks, results] = await Promise.all([
        db.query.feedbacks.findMany({
          orderBy: { created: "desc" },
          offset: getOffsetFromPage(input.page, input.pageSize),
          limit: input.pageSize,
          with: {
            user: {
              columns: condensedUserColumns,
            },
          },
        }),
        getFeedbacksCount(),
      ]);

      return {
        feedback: feedbacks,
        page: input.page,
        pageSize: input.pageSize,
        pages: getPagesFromCount(results, input.pageSize),
        results,
      };
    }),
  createFeedback: authedProcedure
    .input(createFeedbackInputSchema)
    .handler(async ({ context, input }) => {
      const [feedback] = await db
        .insert(feedbacks)
        .values({
          id: crypto.randomUUID(),
          user_id: context.user.id,
          message: input.message,
          created: new Date(),
        })
        .returning();

      return feedback;
    }),
  deleteFeedback: adminProcedure
    .input(z.uuid())
    .handler(async ({ input }) => {
      await db.delete(feedbacks).where(eq(feedbacks.id, input));
    }),
};
