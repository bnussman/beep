import z from "zod";
import { isAlpha, isMobilePhone } from "validator";
import { DEFAULT_PAGE_SIZE } from "../../utils/constants";

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

export const locationSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

export const listsUsersInputSchema = z.object({
  page: z.number().default(1),
  pageSize: z.number().default(DEFAULT_PAGE_SIZE),
  query: z.string().optional(),
  isBeeping: z.boolean().optional(),
});

export const adminEditUserInputSchema = z.object({
  userId: z.uuid(),
  data: z
    .object({
      first: z.string(),
      last: z.string(),
      email: z.string(),
      phone: z.string(),
      venmo: z.string(),
      cashapp: z.string(),
      photo: z.string(),
      isStudent: z.boolean(),
      isEmailVerified: z.boolean(),
      isBeeping: z.boolean(),
      location: z.object({
        longitude: z.number(),
        latitude: z.number(),
      }),
    })
    .partial(),
});

export const editUserInputSchema = z
  .object({
    first: z.string().refine(isAlpha, "Must be letters only.").min(1),
    last: z.string().refine(isAlpha, "Must be letters only.").min(1),
    email: z.email().endsWith(".edu", "Email must end with .edu"),
    phone: z.string().refine(isMobilePhone, "Not a valid phone number."),
    venmo: z.string().nullable(),
    cashapp: z.string().nullable(),
    pushToken: z.string(),
    isBeeping: z.boolean(),
    singlesRate: z.number().min(1).max(25),
    groupRate: z.number().min(1).max(25),
    capacity: z.number().min(1).max(25),
    location: z.object({
      longitude: z.number(),
      latitude: z.number(),
    }),
  })
  .partial();

export const syncUserPaymentsInputSchema = z.object({
  userId: z.uuid().optional()
});

export const activePaymentsInputSchema =
  z.object({ userId: z.uuid() }).optional()

export const listsUsersWithBeepsInputSchema = z.object({
  page: z.number().default(1),
  pageSize: z.number().default(DEFAULT_PAGE_SIZE),
});

export const listsUsersWithRidesInputSchema = z.object({
  page: z.number().default(1),
  pageSize: z.number().default(DEFAULT_PAGE_SIZE),
});

export const sendTestEmailInputSchema = z.object({ userId: z.uuid() })