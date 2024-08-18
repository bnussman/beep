import { authedProcedure, publicProcedure, router } from "../utils/trpc";
import { z } from 'zod';
import { db } from "../utils/db";
import { forgot_password, token, user, verify_email } from "../../drizzle/schema";
import { eq, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { password as bunPassword } from "bun";
import { s3 } from "../utils/s3";
import { S3_BUCKET_URL, WEB_BASE_URL } from "../utils/constants";
import { email } from "../utils/email";
import { SendMailOptions } from "nodemailer";
import * as Sentry from '@sentry/bun';

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

      const {
        success,
        data: input,
        error
      } = signupSchema.safeParse(object);

      if (!success) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          cause: error,
        });
      }

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

      const verifyEmailEntry = await db
        .insert(verify_email)
        .values({
          email: input.email,
          id: crypto.randomUUID(),
          time: new Date(),
          user_id: userId,
        })
        .returning();

      const mailOptions: SendMailOptions = {
        from: 'Beep App <banks@ridebeep.app>',
        to: input.email,
        subject: 'Verify your Beep App Email!',
        html: `Hey ${input.username}, <br><br>
                Head to ${WEB_BASE_URL}/account/verify/${verifyEmailEntry[0].id} to verify your email. This link will expire in 5 hours. <br><br>
                - Beep App Team
            `
      };

      try {
        await email.sendMail(mailOptions);
      } catch (error) {
        Sentry.captureException(error);
      }

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
  forgotPassword: publicProcedure
    .input(
      z.object({
        email: z.string()
      })
    )
    .mutation(async ({ input }) => {
      const u = await db.query.user.findFirst({
        where: eq(user.email, input.email)
      });

      if (!u) {
        return input.email;
      }

      const existingForgotPassword = await db
        .query
        .forgot_password
        .findFirst({
          where: eq(forgot_password.user_id, u.id),
        });

      if (existingForgotPassword) {
        if (existingForgotPassword.time.getTime() + 18000 * 1000 < Date.now()) {
          // The user's existing forgot password request has expired.'
          // We will delete it, and proceed with creating a new one.
          await db.delete(forgot_password).where(eq(forgot_password.id, existingForgotPassword.id));
        } else {
          // The user has an existing forgot password link that is still valid.
          // Keep the same entry in the database, just resend the email.
          const mailOptions: SendMailOptions = {
            from: 'Beep App <banks@ridebeep.app>',
            to: u.email,
            subject: 'Change your Beep App password',
            html: `Hey ${u.username}, <br><br>
                    Head to ${WEB_BASE_URL}/password/reset/${existingForgotPassword.id} to reset your password. This link will expire in 5 hours. <br><br>
                    - Beep App Team
                `
          };

          try {
            await email.sendMail(mailOptions);
          } catch (error) {
            Sentry.captureException(error);
          }

          return u.email;
        }
      }

      const forgotPasswordValues = {
        id: crypto.randomUUID(),
        time: new Date(),
        user_id: u.id,
      };

      await db.insert(forgot_password).values(forgotPasswordValues);

      const mailOptions: SendMailOptions = {
        from: 'Beep App <banks@ridebeep.app>',
        to: u.email,
        subject: 'Change your Beep App password',
        html: `Hey ${u.username}, <br><br>
                Head to ${WEB_BASE_URL}/password/reset/${forgotPasswordValues.id} to reset your password. This link will expire in 5 hours. <br><br>
                - Beep App Team
            `
      };

      try {
        await email.sendMail(mailOptions);
      } catch (error) {
        Sentry.captureException(error);
      }

      return u.email;
    })
});
