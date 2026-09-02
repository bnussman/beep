import z from "zod";
import { DEFAULT_PAGE_SIZE } from "../../utils/constants";

export const getFeedbacksInputSchema = z.object({
  page: z.number().default(1),
  pageSize: z.number().default(DEFAULT_PAGE_SIZE),
});

export const createFeedbackInputSchema =
  z.object({
    message: z.string(),
  });
