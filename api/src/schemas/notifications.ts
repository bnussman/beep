import z from "zod";

export const sendNotificationInputSchema = z.object({
  title: z.string(),
  body: z.string(),
  emailMatch: z.string().optional(),
});

export const sendNotificationToUserInputSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  userId: z.uuid(),
});