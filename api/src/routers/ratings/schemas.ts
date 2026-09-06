import z from "zod";

export const listRatingsInputSchema = z.object({
  userId: z.uuid().optional(),
});

export const deleteRatingInputSchema = z.object({
  ratingId: z.uuid(),
});

export const createRatingInputSchema = z.object({
  stars: z.number().min(1).max(5),
  message: z.string().max(255).optional(),
  beepId: z.uuid(),
  userId: z.uuid(),
});