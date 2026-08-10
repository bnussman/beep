import z from "zod";
import { userSchema } from "./user";

export const authSchema = z.object({
  tokens: z.object({
    id: z.string(),
    tokenid: z.string(),
  }),
  user: userSchema,
});