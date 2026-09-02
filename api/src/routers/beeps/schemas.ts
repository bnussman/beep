import z from "zod";
import { beepStatuses } from "../../../drizzle/schema";
import { DEFAULT_PAGE_SIZE } from "../../utils/constants";

export const editBeepInputSchema = z.object({
  beepId: z.uuid(),
  data: z
    .object({
      origin: z.string().min(2),
      destination: z.string().min(2),
      groupSize: z.number().min(1).max(25),
    })
    .partial(),
});

export const getBeepsInputSchema =
  z.object({
    cursor: z.number().min(1).optional(),
    page: z.number().min(1).optional(),
    pageSize: z.number().default(DEFAULT_PAGE_SIZE),
    inProgress: z.boolean().optional(),
    status: z.array(z.enum(beepStatuses)).optional(),
    userId: z.string().optional(),
  });

export const clearQueueInputSchema =
  z.object({
    userId: z.string(),
    stopBeeping: z.boolean(),
  });

export const updateBeepAsBeeperInputSchema = z.object({
  beepId: z.string(),
  data: z.object({
    status: z.enum(beepStatuses),
  }),
});