import z from "zod";
import { queueResponseSchema } from "../schemas/beeper";

export type Queue = z.infer<typeof queueResponseSchema>;