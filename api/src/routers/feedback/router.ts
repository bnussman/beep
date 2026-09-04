import { z } from "zod";
import { adminProcedure, authedProcedure } from "../../utils/orpc";
import { db } from "../../utils/db";
import { eq } from "drizzle-orm";
import { feedbacks } from "../../../drizzle/schema";
import { condensedUserColumns } from "../users/logic";
import { createFeedbackInputSchema, getFeedbacksInputSchema } from "./schemas";
import { getFeedbacksCount } from "./logic";
import { getOffsetFromPage, getPagesFromCount } from "../../utils/pagination";

export const feedbackRouter = {
  feedback: adminProcedure
    .input(getFeedbacksInputSchema)
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
