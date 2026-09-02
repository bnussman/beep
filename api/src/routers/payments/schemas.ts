import z from "zod";
import { DEFAULT_PAGE_SIZE } from "../../utils/constants";

export const listPaymentsInputSchema = z.object({
  page: z.number().default(1),
  pageSize: z.number().default(DEFAULT_PAGE_SIZE),
  userId: z.string().optional(),
  active: z.boolean().optional(),
});