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
  created: z.union([z.date(), z.string()]).nullable(),
  location: z
    .object({ latitude: z.number(), longitude: z.number() })
    .nullable(),
});
