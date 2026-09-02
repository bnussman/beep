import z from "zod";
import { queueResponseSchema } from "./schemas";

export type Queue = z.infer<typeof queueResponseSchema>;