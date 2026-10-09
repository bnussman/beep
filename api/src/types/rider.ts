import z from "zod";
import { rideResponseSchema } from "../schemas/rider";

export type Ride = z.infer<typeof rideResponseSchema> | null;