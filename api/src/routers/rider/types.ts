import z from "zod";
import { rideResponseSchema } from "./schemas";

export type Ride = z.infer<typeof rideResponseSchema> | null;