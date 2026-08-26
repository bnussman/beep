import { authedProcedure, o } from "../utils/orpc";
import { db } from "../utils/db";
import { forgot_password, token, user, verify_email } from "../../drizzle/schema";
import { and, eq, ne, sql } from "drizzle-orm";
import { password as bunPassword } from "bun";
import { s3 } from "../utils/s3";
import { isDevelopment, S3_BUCKET_URL } from "../utils/constants";
import { pubSub } from "../utils/pubsub";
import { authSchema, changePasswordInput, forgotPasswordInput, loginInput, logoutInput, resetPasswordInput, verifyAccountInput } from "../schemas/auth";
import { signupSchema, userSchema } from "../schemas/user";
import { ORPCError, ValidationError } from "@orpc/server";
import { isExpired, sendResetPasswordEmail, sendSignupVerificationEmail } from "../logic/auth";

export const authRouter = {
  login: o
    .input(loginInput)
    .output(authSchema)
    .handler(async ({ input }) => {
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
        throw new ORPCError("NOT_FOUND", {
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
          throw new Error(`Unknown password type ${u.passwordType}`);
      }

      if (!isPasswordCorrect) {
        throw new ORPCError("NOT_FOUND", {
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
  signup: o
    .input(signupSchema)
    .output(authSchema)
    .handler(async ({ input }) => {
      const userId = crypto.randomUUID();

      const existing = await db.query.user.findFirst({
        where: {
          RAW: (table) =>
            sql`lower(${table.email}) = ${input.email.toLowerCase()}`,
        },
      });

      if (existing) {
        const issues = [
          {
            code: "invalid_value",
            path: ["email"],
            message: "A user with that email already exists.",
            values: [input.email],
          },
        ];
        throw new ORPCError('BAD_REQUEST', {
          message: 'Input validation failed',
          data: {
            issues,
          },
          cause: new ValidationError({
            message: 'Input validation failed',
            issues,
            invalidData: input,
          }),
        })
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

      await sendSignupVerificationEmail({
        email: input.email,
        token: verifyEmailEntry[0].id,
        username: input.username,
      });

      return { user: u[0], tokens };
    }),
  logout: authedProcedure
    .input(logoutInput)
    .handler(async ({ context, input }) => {
      await db.delete(token).where(eq(token.id, context.token.id));

      if (input.isApp) {
        await db
          .update(user)
          .set({ pushToken: null })
          .where(eq(user.id, context.user.id));
      }
    }),
  forgotPassword: o
    .input(forgotPasswordInput)
    .handler(async ({ input }) => {
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
        if (isExpired(existingForgotPassword.time)) {
          // The user's existing forgot password request has expired.
          // We will delete it, and proceed with creating a new one.
          await db
            .delete(forgot_password)
            .where(eq(forgot_password.id, existingForgotPassword.id));
        } else {
          // The user has an existing forgot password link that is still valid.
          // Keep the same entry in the database, just resend the email.
          await sendResetPasswordEmail({
            email: u.email,
            username: u.username,
            token: existingForgotPassword.id,
          });

          return u.email;
        }
      }

      const forgotPasswordValues = {
        id: crypto.randomUUID(),
        time: new Date(),
        user_id: u.id,
      };

      await db.insert(forgot_password).values(forgotPasswordValues);

      await sendResetPasswordEmail({
        email: u.email,
        username: u.username,
        token: forgotPasswordValues.id,
      });

      return u.email;
    }),
  resetPassword: o
    .input(resetPasswordInput)
    .handler(async ({ input }) => {
      const forgotPassword = await db.query.forgot_password.findFirst({
        where: { id: input.id },
      });

      if (!forgotPassword) {
        throw new ORPCError("NOT_FOUND", {
          message: "Password reset request not found.",
        });
      }

      if (isExpired(forgotPassword.time)) {
        await db
          .delete(forgot_password)
          .where(eq(forgot_password.id, forgotPassword.id));

        throw new ORPCError("NOT_FOUND", {
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
  verifyAccount: o
    .input(verifyAccountInput)
    .handler(async ({ input }) => {
      const verifyAccountEntry = await db.query.verify_email.findFirst({
        where: { id: input.id },
        with: {
          user: true,
        },
      });

      if (!verifyAccountEntry) {
        throw new ORPCError("NOT_FOUND", {
          message: "Unable to find that email verification entry.",
        });
      }

      if (isExpired(verifyAccountEntry.time)) {
        await db
          .delete(verify_email)
          .where(eq(verify_email.id, verifyAccountEntry.id));

        throw new ORPCError("NOT_FOUND", {
          message:
            "Your account verification link has expired. Login to your account to request another link.",
        });
      }

      if (verifyAccountEntry.email !== verifyAccountEntry.user.email) {
        await db
          .delete(verify_email)
          .where(eq(verify_email.id, verifyAccountEntry.id));

        throw new ORPCError("BAD_REQUEST", {
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

      pubSub.publish(`user-${u[0].id}`, { user: u[0] });

      return u[0].email;
    }),
  resendVerification: authedProcedure.handler(async ({ context }) => {
    await db.delete(verify_email).where(eq(verify_email.user_id, context.user.id));

    const verifyEmailEntry = {
      id: crypto.randomUUID(),
      email: context.user.email,
      user_id: context.user.id,
      time: new Date(),
    };

    await db.insert(verify_email).values(verifyEmailEntry);

    await sendSignupVerificationEmail({
      email: verifyEmailEntry.email,
      username: context.user.email,
      token: verifyEmailEntry.id,
    });
  }),
  changePassword: authedProcedure
    .input(changePasswordInput)
    .output(userSchema)
    .handler(async ({ input, context }) => {
      const password = await bunPassword.hash(input.password, "bcrypt");

      await db
        .update(user)
        .set({ password, passwordType: "bcrypt" })
        .where(eq(user.id, context.user.id));

      await db
        .delete(token)
        .where(
          and(
            eq(token.user_id, context.user.id),
            ne(token.id, context.token.id)
          )
        );

      return context.user;
    }),
};
