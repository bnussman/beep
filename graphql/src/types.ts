import { user } from "../drizzle/schema";
import { builder } from "./builder";

export type UserTypeFromDB = typeof user.$inferSelect;

export const User = builder.objectRef<UserTypeFromDB>('User');