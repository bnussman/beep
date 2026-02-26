import z from "zod";
import { beepStatuses } from "../../drizzle/schema";

export const rideResponseSchema = z.object({
  id: z.string(),
  start: z.union([z.string(), z.date()]),
  end: z.union([z.string(), z.date()]).nullable(),
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
  }).nullable(),
  position: z.number(),
  queue: z.array(z.object({ status: z.enum(beepStatuses) })),
  riders_waiting: z.number()
});

export const queueResponseSchema = z.array(
  z.object({
    id: z.string(),
    start: z.union([z.string(), z.date()]),
    end: z.union([z.string(), z.date()]).nullable(),
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
