import { authedProcedure, publicProcedure, router } from "../utils/trpc";
import { z } from 'zod';
import { db } from "../utils/db";
import { token, user } from "../../drizzle/schema";
import { eq, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { password as bunPassword } from "bun";
import { s3 } from "../utils/s3";
import { S3_BUCKET_URL } from "../utils/constants";

export const authRouter = router({
  login: publicProcedure
    .input(z.object({
      username: z.string(),
      password: z.string(),
      pushToken: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { username, password, pushToken } = input;

      const u = await db.query.user.findFirst({
        where: or(eq(user.username, username), eq(user.email, username))
      });

      if (!u) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User does not exist or credentials are incorrect."
        });
      }
      let isPasswordCorrect = false;

      switch (u.passwordType) {
        case "sha256":
          const hasher = new Bun.CryptoHasher("sha256");
          hasher.update(password);

          isPasswordCorrect = hasher.digest("hex") === u.password;
          break;
        case "bcrypt":
          isPasswordCorrect = await bunPassword.verify(
            password,
            u.password,
            "bcrypt",
          );
          break;
        default:
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Unknown password type ${u.passwordType}`
          });
      }

      if (!isPasswordCorrect) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User does not exist or credentials are incorrect."
        });
      }

      const tokens = {
        id: crypto.randomUUID(),
        tokenid: crypto.randomUUID(),
        user_id: u.id,
      };

      await db.insert(token).values(tokens);

      if (pushToken) {
        await db.update(user).set({ pushToken: pushToken }).where(eq(user.id, u.id));
        u.pushToken = pushToken;
      }

      return { user: u, tokens };
    }),
  signup: publicProcedure
    .input(z.instanceof(FormData))
    .mutation(async ({ input: formData }) => {
      const object = {} as Record<string, unknown>;

      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          object[key] = value;
        } else {
          object[key] = value;
        }
      }

      const userId = crypto.randomUUID();

      const input = signupSchema.parse(object);

      const extention = input.photo.name.substring(
        input.photo.name.lastIndexOf("."),
        input.photo.name.length,
      );

      const objectKey = `images/${userId}-${Date.now()}${extention}`;

      await s3.putObject(objectKey, input.photo.stream(), {
        metadata: { "x-amz-acl": "public-read" },
      });

      const password = await bunPassword.hash(input.password, "bcrypt");

      const u = await db.insert(user).values({
        id: userId,
        ...input,
        password,
        passwordType: 'bcrypt',
        photo: S3_BUCKET_URL + objectKey,
      }).returning();

      const tokens = {
        id: crypto.randomUUID(),
        tokenid: crypto.randomUUID(),
        user_id: userId,
      };

      await db.insert(token).values(tokens);

      return { user: u[0], tokens };
    }),
  logout: authedProcedure
    .input(
      z.object({ isApp: z.boolean().optional() })
    )
    .mutation(async ({ ctx, input }) => {
      await db.delete(token).where(eq(token.id, ctx.token.id));

      if (input.isApp) {
        await db.update(user).set({ pushToken: null }).where(eq(user.id, ctx.user.id));
      }
    }),
});

const signupSchema = z.object({
  first: z.string(),
  last: z.string(),
  username: z.string(),
  password: z.string(),
  email: z.string().email().endsWith('.edu', 'Email must end with .edu'),
  phone: z.string(),
  venmo: z.string().optional(),
  cashapp: z.string().optional(),
  pushToken: z.string().optional(),
  photo: z.instanceof(File),
});
