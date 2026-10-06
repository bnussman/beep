import z from "zod";

export const listPaymentsInputSchema = z.object({
  userId: z.string().optional(),
  active: z.boolean().optional(),
});