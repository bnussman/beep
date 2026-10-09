import z from "zod";

export const createFeedbackInputSchema =
  z.object({
    message: z.string(),
  });
