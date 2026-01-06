import { authedProcedure, publicProcedure, router } from "../utils/trpc";
import { z, ZodError } from "zod";
import { db } from "../utils/db";
import {
  forgot_password,
  token,
  user,
  verify_email,
} from "../../drizzle/schema";
import { and, eq, ne, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { password as bunPassword } from "bun";
import { s3 } from "../utils/s3";
import { isDevelopment, S3_BUCKET_URL, WEB_BASE_URL } from "../utils/constants";
import { email } from "../utils/email";
import { SendMailOptions } from "nodemailer";
import * as Sentry from "@sentry/bun";
import { pubSub } from "../utils/pubsub";
import { isAlpha, isMobilePhone } from "validator";

export const authRouter = router({
  login: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
        pushToken: z.string().nullable().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { username, password, pushToken } = input;

      const u = await db.query.user.findFirst({
        where: {
          OR: [
            { username },
            {
              RAW: (table) =>
                sql`lower(${table.email}) = ${username.toLowerCase()}`,
            },
          ],
        },
      });

      if (!u) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User does not exist or credentials are incorrect.",
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
            message: `Unknown password type ${u.passwordType}`,
          });
      }

      if (!isPasswordCorrect) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User does not exist or credentials are incorrect.",
        });
      }

      const tokens = {
        id: crypto.randomUUID(),
        tokenid: crypto.randomUUID(),
        user_id: u.id,
      };

      await db.insert(token).values(tokens);

      if (pushToken) {
        await db
          .update(user)
          .set({ pushToken: pushToken })
          .where(eq(user.id, u.id));
        u.pushToken = pushToken;
      }

      return { user: u, tokens };
    }),
  signup: publicProcedure
    .input(z.instanceof(FormData))
    .mutation(async ({ input: formData }) => {
      const userId = crypto.randomUUID();

      const signupSchema = z.object({
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
        email: z.string().email().endsWith(".edu", "You must use a .edu email"),
        phone: z.string().refine(isMobilePhone, "Invalid phone number"),
        venmo: z.string().max(30).optional(),
        cashapp: z.string().max(40).optional(),
        pushToken: z.string().optional(),
        photo: z.instanceof(File, {
          message: "You must add a profile picture",
        }),
      });

      const {
        success,
        data: input,
        error,
      } = signupSchema.safeParse(Object.fromEntries(formData.entries()));

      if (!success) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          cause: error,
        });
      }

      const existing = await db.query.user.findFirst({
        where: {
          RAW: (table) =>
            sql`lower(${table.email}) = ${input.email.toLowerCase()}`,
        },
      });

      if (existing) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          cause: new ZodError([
            {
              code: "custom",
              path: ["email"],
              message: "A user with that email already exists.",
            },
          ]),
        });
      }

      const extention = input.photo.name.substring(
        input.photo.name.lastIndexOf("."),
        input.photo.name.length,
      );

      const objectKey = `images/${userId}-${Date.now()}${extention}`;

      await s3.write(objectKey, input.photo, {
        acl: "public-read",
      });

      const password = await bunPassword.hash(input.password, "bcrypt");

      const u = await db
        .insert(user)
        .values({
          id: userId,
          ...input,
          password,
          passwordType: "bcrypt",
          created: new Date(),
          photo: S3_BUCKET_URL + objectKey,
          ...(isDevelopment && {
            isEmailVerified: true,
            isStudent: true,
          }),
        })
        .returning();

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
        from: "Beep App <banks@ridebeep.app>",
        to: input.email,
        subject: "Verify your Beep App Email!",
        html: `Hey ${input.username}, <br><br>
                Head to ${WEB_BASE_URL}/account/verify/${verifyEmailEntry[0].id} to verify your email. This link will expire in 5 hours. <br><br>
                - Beep App Team
            `,
      };

      try {
        await email.sendMail(mailOptions);
      } catch (error) {
        Sentry.captureException(error);
      }

      return { user: u[0], tokens };
    }),
  logout: authedProcedure
    .input(z.object({ isApp: z.boolean().optional() }))
    .mutation(async ({ ctx, input }) => {
      await db.delete(token).where(eq(token.id, ctx.token.id));

      if (input.isApp) {
        await db
          .update(user)
          .set({ pushToken: null })
          .where(eq(user.id, ctx.user.id));
      }
    }),
  forgotPassword: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      }),
    )
    .mutation(async ({ input }) => {
      const u = await db.query.user.findFirst({
        where: { email: input.email },
      });

      if (!u) {
        return input.email;
      }

      const existingForgotPassword = await db.query.forgot_password.findFirst({
        where: { user_id: u.id },
      });

      if (existingForgotPassword) {
        if (existingForgotPassword.time.getTime() + 18000 * 1000 < Date.now()) {
          // The user's existing forgot password request has expired.
          // We will delete it, and proceed with creating a new one.
          await db
            .delete(forgot_password)
            .where(eq(forgot_password.id, existingForgotPassword.id));
        } else {
          // The user has an existing forgot password link that is still valid.
          // Keep the same entry in the database, just resend the email.
          const mailOptions: SendMailOptions = {
            from: "Beep App <banks@ridebeep.app>",
            to: u.email,
            subject: "Change your Beep App password",
            html: `Hey ${u.username}, <br><br>
                    Head to ${WEB_BASE_URL}/password/reset/${existingForgotPassword.id} to reset your password. This link will expire in 5 hours. <br><br>
                    - Beep App Team
                `,
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
        from: "Beep App <banks@ridebeep.app>",
        to: u.email,
        subject: "Change your Beep App password",
        html: `Hey ${u.username}, <br><br>
                Head to ${WEB_BASE_URL}/password/reset/${forgotPasswordValues.id} to reset your password. This link will expire in 5 hours. <br><br>
                - Beep App Team
            `,
      };

      try {
        await email.sendMail(mailOptions);
      } catch (error) {
        Sentry.captureException(error);
      }

      return u.email;
    }),
  resetPassword: publicProcedure
    .input(
      z.object({
        id: z.string(),
        password: z.string().min(6),
      }),
    )
    .mutation(async ({ input }) => {
      const forgotPassword = await db.query.forgot_password.findFirst({
        where: { id: input.id },
      });

      if (!forgotPassword) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Password reset request not found.",
        });
      }

      if (forgotPassword.time.getTime() + 18000 * 1000 < Date.now()) {
        await db
          .delete(forgot_password)
          .where(eq(forgot_password.id, forgotPassword.id));

        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This password reset request has expired.",
        });
      }

      await db
        .update(user)
        .set({
          password: await bunPassword.hash(input.password, "bcrypt"),
          passwordType: "bcrypt",
        })
        .where(eq(user.id, forgotPassword.user_id));

      await db
        .delete(forgot_password)
        .where(eq(forgot_password.id, forgotPassword.id));

      // Remove all of the user's auth tokens because they have a new password.
      await db.delete(token).where(eq(token.user_id, forgotPassword.user_id));

      return true;
    }),
  verifyAccount: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const verifyAccountEntry = await db.query.verify_email.findFirst({
        where: { id: input.id },
        with: {
          user: true,
        },
      });

      if (!verifyAccountEntry) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Unable to find that email verification entry.",
        });
      }

      if (verifyAccountEntry.time.getTime() + 18000 * 1000 < Date.now()) {
        await db
          .delete(verify_email)
          .where(eq(verify_email.id, verifyAccountEntry.id));

        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            "Your account verification link has expired. Login to your account to request another link.",
        });
      }

      if (verifyAccountEntry.email !== verifyAccountEntry.user.email) {
        await db
          .delete(verify_email)
          .where(eq(verify_email.id, verifyAccountEntry.id));

        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "You tried to verify your email, but your email has changed. Login to request a new verification link.",
        });
      }

      const isStudent = verifyAccountEntry.email.endsWith(".edu");
      const values = isStudent
        ? { isStudent: true, isEmailVerified: true }
        : { isEmailVerified: true };

      const u = await db
        .update(user)
        .set(values)
        .where(eq(user.id, verifyAccountEntry.user_id))
        .returning();

      await db
        .delete(verify_email)
        .where(eq(verify_email.id, verifyAccountEntry.id));

      pubSub.publish("user", u[0].id, { user: u[0] });

      return u[0].email;
    }),
  resendVerification: authedProcedure.mutation(async ({ ctx }) => {
    await db.delete(verify_email).where(eq(verify_email.user_id, ctx.user.id));

    const verifyEmailEntry = {
      id: crypto.randomUUID(),
      email: ctx.user.email,
      user_id: ctx.user.id,
      time: new Date(),
    };

    await db.insert(verify_email).values(verifyEmailEntry);

    const mailOptions: SendMailOptions = {
      from: "Beep App <banks@ridebeep.app>",
      to: ctx.user.email,
      subject: "Verify your Beep App Email!",
      html: `Hey ${ctx.user.username}, <br><br>
                Head to ${WEB_BASE_URL}/account/verify/${verifyEmailEntry.id} to verify your email. This link will expire in 5 hours. <br><br>
                - Beep App Team
            `,
    };

    try {
      await email.sendMail(mailOptions);
    } catch (error) {
      Sentry.captureException(error);
    }
  }),
  changePassword: authedProcedure
    .input(
      z.object({
        password: z.string().min(6),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const password = await bunPassword.hash(input.password, "bcrypt");

      await db
        .update(user)
        .set({ password, passwordType: "bcrypt" })
        .where(eq(user.id, ctx.user.id));

      await db
        .delete(token)
        .where(and(eq(token.user_id, ctx.user.id), ne(token.id, ctx.token.id)));

      return ctx.user;
    }),
});
