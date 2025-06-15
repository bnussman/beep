import { user } from "../drizzle/schema";
import { builder } from "./builder";

export type User = typeof user.$inferSelect;

export const User = builder.objectRef<typeof user.$inferSelect>('User');