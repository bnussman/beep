import z from "zod";
import { queueResponseSchema } from "./beeper";

export type Queue = z.infer<typeof queueResponseSchema>;