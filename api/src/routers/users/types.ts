import z from "zod";
import { users } from "../../../drizzle/schema";
import { locationSchema } from "./schemas";

export type User = typeof users.$inferSelect;

export type Location = z.infer<typeof locationSchema>;