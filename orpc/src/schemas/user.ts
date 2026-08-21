import { isAlpha, isMobilePhone } from "validator";
import z from "zod";

export const userSchema = z.object({
  id: z.string(),
  first: z.string(),
  last: z.string(),
  username: z.string(),
  email: z.string(),
  phone: z.string(),
  venmo: z.string().nullable(),
  cashapp: z.string().nullable(),
  isBeeping: z.boolean(),
  isEmailVerified: z.boolean(),
  isStudent: z.boolean(),
  groupRate: z.number(),
  singlesRate: z.number(),
  capacity: z.number(),
  queueSize: z.number(),
  rating: z.string().nullable(),
  role: z.enum(["user", "admin"]),
  photo: z.string().nullable(),
  created: z.coerce.date().nullable(),
  location: z
    .object({ latitude: z.number(), longitude: z.number() })
    .nullable(),
});

export const signupSchema = z.object({
  first: z
    .string()
    .min(1)
    .max(64)
    .refine(isAlpha, "Must only contain letters"),
  last: z
    .string()
    .min(1)
    .max(64)
    .refine(isAlpha, "Must only contain letters"),
  username: z.string().min(3).max(64),
  password: z.string().min(6).max(255),
  email: z.email().endsWith(".edu", "You must use a .edu email"),
  phone: z.string().refine(isMobilePhone, "Invalid phone number"),
  venmo: z.string().max(30).optional(),
  cashapp: z.string().max(40).optional(),
  pushToken: z.string().optional(),
  photo: z.instanceof(File, { error: "You must provide a profile photo" }),
});
