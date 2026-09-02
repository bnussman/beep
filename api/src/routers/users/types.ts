import z from "zod";
import { user } from "../../../drizzle/schema";
import { locationSchema } from "./schemas";

export type User = typeof user.$inferSelect;

export type Location = z.infer<typeof locationSchema>;