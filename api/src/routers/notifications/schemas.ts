import z from "zod";

export const sendNotificationInputSchema = z.object({
  title: z.string(),
  body: z.string(),
  emailMatch: z.string().optional(),
});

export const sendNotificationToUserInputSchema = z.object({
  title: z.string(),
  body: z.string(),
  userId: z.uuid(),
});