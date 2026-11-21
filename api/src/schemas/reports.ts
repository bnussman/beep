import z from "zod";

export const listReportsInputSchema = z.object({
  userId: z.uuid().optional(),
});

export const updateReportInputSchema = z.object({
  reportId: z.uuid(),
  data: z.object({
    notes: z.string().max(255).nullable().optional(),
    handled: z.boolean().nullable().optional(),
  }),
});

export const createReportInputSchema = 
  z.object({
    userId: z.uuid(),
    reason: z.string().max(255),
    beepId: z.uuid().optional(),
    ratingId: z.uuid().optional(),
  });