import z from "zod";
import { userSchema } from "./user.ts";

export const authSchema = z.object({
  tokens: z.object({
    id: z.string(),
    tokenid: z.string(),
  }),
  user: userSchema,
});