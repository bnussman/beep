import z from "zod";
import { DEFAULT_PAGE_SIZE } from "../../utils/constants";

export const listRatingsInputSchema = z.object({
  cursor: z.number().optional().default(1),
  pageSize: z.number().default(DEFAULT_PAGE_SIZE),
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