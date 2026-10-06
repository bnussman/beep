import z from "zod";
import { rideResponseSchema } from "./rider";

export type Ride = z.infer<typeof rideResponseSchema> | null;