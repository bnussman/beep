import z from "zod";
import { userSchema } from "../users/schemas";

export const authSchema = z.object({
  tokens: z.object({
    id: z.string(),
    tokenid: z.string(),
  }),
  user: userSchema,
});

export const loginInput = z.object({
  username: z.string(),
  password: z.string(),
  pushToken: z.string().nullable().optional(),
});

export const logoutInput = z.object({
  isApp: z.boolean().optional()
});

export const forgotPasswordInput = z.object({
  email: z.email()
});

export const resetPasswordInput = z.object({
  id: z.string(),
  password: z.string().min(6),
});

export const verifyAccountInput = z.object({
  id: z.string(),
});

export const changePasswordInput = z.object({
  password: z.string().min(6),
});