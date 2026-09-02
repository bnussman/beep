import z from "zod";
import { beepStatuses } from "../../../drizzle/schema";

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