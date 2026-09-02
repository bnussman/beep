import { z } from "zod";
import { adminProcedure, authedProcedure } from "../../utils/orpc";
import { db } from "../../utils/db";
import { eq } from "drizzle-orm";
import { feedback } from "../../../drizzle/schema";
import { condensedUserColumns } from "../users/logic";
import { createFeedbackInputSchema, getFeedbacksInputSchema } from "./schemas";
import { getFeedbacksCount } from "./logic";

export const feedbackRouter = {
  feedback: adminProcedure
    .input(getFeedbacksInputSchema)
    .handler(async ({ input }) => {
      const [feedbacks, results] = await Promise.all([
        db.query.feedback.findMany({
          orderBy: { created: "desc" },
          offset: (input.page - 1) * input.pageSize,
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
        pages: Math.ceil(results / input.pageSize),
        results,
      };
    }),
  createFeedback: authedProcedure
    .input(createFeedbackInputSchema)
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
    .input(z.uuid())
    .handler(async ({ input }) => {
      await db.delete(feedback).where(eq(feedback.id, input));
    }),
};
