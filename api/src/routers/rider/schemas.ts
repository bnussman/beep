import z from "zod";
import { beepStatuses } from "../../../drizzle/schema";

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

export const startBeepInputSchema = z.object({
  beeperId: z.string(),
  origin: z.string(),
  destination: z.string(),
  groupSize: z.number().min(1).max(25),
  latitude: z.number(),
  longitude: z.number(),
});


export const getBeeperLocationsInputSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  admin: z.boolean().optional(),
});


export const getBeepersInputSchema = z
  .object({
    longitude: z.number(),
    latitude: z.number(),
  })
  .optional();

export const updateLiveActivityTokenInputSchema = z.object({
  activityId: z.string(),
  token: z.string()
});

export const setBeepLiveActivityTokenInputSchema = 
  z.object({
    beepId: z.uuid(),
    token: z.string(),
    activityId: z.string(),
  });

export const leaveQueueInputSchema = z.object({
  beeperId: z.uuid(),
});