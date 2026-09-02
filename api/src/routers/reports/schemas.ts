import z from "zod";
import { DEFAULT_PAGE_SIZE } from "../../utils/constants";

export const listReportsInputSchema = z.object({
  page: z.number().default(1),
  pageSize: z.number().default(DEFAULT_PAGE_SIZE),
  userId: z.uuid().optional(),
});

export const updateReportInputSchema = z.object({
  reportId: z.uuid(),
  data: z.object({
    notes: z.string().nullable().optional(),
    handled: z.boolean().nullable().optional(),
  }),
});

export const createReportInputSchema = 
  z.object({
    userId: z.uuid(),
    reason: z.string(),
    beepId: z.uuid().optional(),
    ratingId: z.uuid().optional(),
  });