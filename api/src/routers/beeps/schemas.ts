import z from "zod";
import { beepStatuses } from "../../../drizzle/schema";
import { DEFAULT_PAGE_SIZE } from "../../utils/constants";

export const rideResponseSchema = z.object({
  id: z.string(),
  start: z.coerce.date(),
  end: z.coerce.date().nullable(),
  origin: z.string(),
  destination: z.string(),
  groupSize: z.number(),
  status: z.enum(beepStatuses),
  beeper: z.object({
    id: z.string(),
    first: z.string(),
    last: z.string(),
    venmo: z.string().nullable(),
    cashapp: z.string().nullable(),
    groupRate: z.number(),
    singlesRate: z.number(),
    photo: z.string().nullable(),
  }),
  position: z.number(),
  queue: z.array(z.object({ status: z.enum(beepStatuses) })),
  riders_waiting: z.number(),
  pick_up_eta: z.coerce.date().nullable(),
});

export const queueResponseSchema = z.array(
  z.object({
    id: z.string(),
    start: z.coerce.date(),
    end: z.coerce.date().nullable(),
    origin: z.string(),
    destination: z.string(),
    groupSize: z.number(),
    status: z.enum(beepStatuses),
    rider: z.object({
      id: z.string(),
      first: z.string(),
      last: z.string(),
      venmo: z.string().nullable(),
      cashapp: z.string().nullable(),
      photo: z.string().nullable(),
      rating: z.string().nullable(),
    }),
  }),
);

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