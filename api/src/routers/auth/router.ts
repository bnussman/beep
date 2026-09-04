import { authedProcedure, o } from "../../utils/orpc";
import { db } from "../../utils/db";
import { emailVerifications, forgotPasswords, tokens, users } from "../../../drizzle/schema";
import { and, eq, ne, sql } from "drizzle-orm";
import { password as bunPassword } from "bun";
import { s3 } from "../../utils/s3";
import { isDevelopment, S3_BUCKET_URL } from "../../utils/constants";
import { pubSub } from "../../utils/pubsub";
import { authSchema, changePasswordInput, forgotPasswordInput, loginInput, logoutInput, resetPasswordInput, verifyAccountInput } from "./schemas";
import { signupSchema, userSchema } from "../users/schemas";
import { ORPCError, ValidationError } from "@orpc/server";
import { isExpired, sendResetPasswordEmail, sendSignupVerificationEmail } from "./logic";
import { sha256 } from "../../utils/hash";

export const authRouter = {
  login: o
    .input(loginInput)
    .output(authSchema)
    .handler(async ({ input }) => {
      const { username, password, pushToken } = input;

      const user = await db.query.users.findFirst({
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

      if (!user) {
        throw new ORPCError("NOT_FOUND", {
          message: "User does not exist or credentials are incorrect.",
        });
      }

      let isPasswordCorrect = false;

      switch (user.passwordType) {
        case "sha256":
          isPasswordCorrect = sha256(password) === user.password;
          break;
        case "bcrypt":
          isPasswordCorrect = await bunPassword.verify(
            password,
            user.password,
            "bcrypt",
          );
          break;
        default:
          throw new Error(`Unknown password type ${user.passwordType}`);
      }

      if (!isPasswordCorrect) {
        throw new ORPCError("NOT_FOUND", {
          message: "User does not exist or credentials are incorrect.",
        });
      }

      const tokenData = {
        id: crypto.randomUUID(),
        tokenid: crypto.randomUUID(),
        user_id: user.id,
      };

      await db.insert(tokens).values(tokenData);

      if (pushToken) {
        await db
          .update(users)
          .set({ pushToken: pushToken })
          .where(eq(users.id, user.id));
        user.pushToken = pushToken;
      }

      return { user, tokens: tokenData };
    }),
  signup: o
    .input(signupSchema)
    .output(authSchema)
    .handler(async ({ input }) => {
      const userId = crypto.randomUUID();

      const existing = await db.query.users.findFirst({
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

      const [user] = await db
        .insert(users)
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

      const tokensData = {
        id: crypto.randomUUID(),
        tokenid: crypto.randomUUID(),
        user_id: userId,
      };

      await db.insert(tokens).values(tokensData);

      const [verifyEmailEntry] = await db
        .insert(emailVerifications)
        .values({
          email: input.email,
          id: crypto.randomUUID(),
          time: new Date(),
          user_id: userId,
        })
        .returning();

      await sendSignupVerificationEmail({
        email: input.email,
        token: verifyEmailEntry.id,
        username: input.username,
      });

      return { user, tokens: tokensData };
    }),
  logout: authedProcedure
    .input(logoutInput)
    .handler(async ({ context, input }) => {
      await db.delete(tokens).where(eq(tokens.id, context.token.id));

      if (input.isApp) {
        await db
          .update(users)
          .set({ pushToken: null })
          .where(eq(users.id, context.user.id));
      }
    }),
  forgotPassword: o
    .input(forgotPasswordInput)
    .handler(async ({ input }) => {
      const user = await db.query.users.findFirst({
        where: { email: input.email },
      });

      if (!user) {
        return input.email;
      }

      const existingForgotPassword = await db.query.forgotPasswords.findFirst({
        where: { user_id: user.id },
      });

      if (existingForgotPassword) {
        if (isExpired(existingForgotPassword.time)) {
          // The user's existing forgot password request has expired.
          // We will delete it, and proceed with creating a new one.
          await db
            .delete(forgotPasswords)
            .where(eq(forgotPasswords.id, existingForgotPassword.id));
        } else {
          // The user has an existing forgot password link that is still valid.
          // Keep the same entry in the database, just resend the email.
          await sendResetPasswordEmail({
            email: user.email,
            username: user.username,
            token: existingForgotPassword.id,
          });

          return user.email;
        }
      }

      const forgotPasswordValues = {
        id: crypto.randomUUID(),
        time: new Date(),
        user_id: user.id,
      };

      await db.insert(forgotPasswords).values(forgotPasswordValues);

      await sendResetPasswordEmail({
        email: user.email,
        username: user.username,
        token: forgotPasswordValues.id,
      });

      return user.email;
    }),
  resetPassword: o
    .input(resetPasswordInput)
    .handler(async ({ input }) => {
      const forgotPassword = await db.query.forgotPasswords.findFirst({
        where: { id: input.id },
      });

      if (!forgotPassword) {
        throw new ORPCError("NOT_FOUND", {
          message: "Password reset request not found.",
        });
      }

      if (isExpired(forgotPassword.time)) {
        await db
          .delete(forgotPasswords)
          .where(eq(forgotPasswords.id, forgotPassword.id));

        throw new ORPCError("NOT_FOUND", {
          message: "This password reset request has expired.",
        });
      }

      await db
        .update(users)
        .set({
          password: await bunPassword.hash(input.password, "bcrypt"),
          passwordType: "bcrypt",
        })
        .where(eq(users.id, forgotPassword.user_id));

      await db
        .delete(forgotPasswords)
        .where(eq(forgotPasswords.id, forgotPassword.id));

      // Remove all of the user's auth tokens because they have a new password.
      await db.delete(tokens).where(eq(tokens.user_id, forgotPassword.user_id));

      return true;
    }),
  verifyAccount: o
    .input(verifyAccountInput)
    .handler(async ({ input }) => {
      const verifyAccountEntry = await db.query.emailVerifications.findFirst({
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
          .delete(emailVerifications)
          .where(eq(emailVerifications.id, verifyAccountEntry.id));

        throw new ORPCError("NOT_FOUND", {
          message:
            "Your account verification link has expired. Login to your account to request another link.",
        });
      }

      if (verifyAccountEntry.email !== verifyAccountEntry.user.email) {
        await db
          .delete(emailVerifications)
          .where(eq(emailVerifications.id, verifyAccountEntry.id));

        throw new ORPCError("BAD_REQUEST", {
          message:
            "You tried to verify your email, but your email has changed. Login to request a new verification link.",
        });
      }

      const isStudent = verifyAccountEntry.email.endsWith(".edu");
      const values = isStudent
        ? { isStudent: true, isEmailVerified: true }
        : { isEmailVerified: true };

      const [user] = await db
        .update(users)
        .set(values)
        .where(eq(users.id, verifyAccountEntry.user_id))
        .returning();

      await db
        .delete(emailVerifications)
        .where(eq(emailVerifications.id, verifyAccountEntry.id));

      pubSub.publish(`user-${user.id}`, { user });

      return user.email;
    }),
  resendVerification: authedProcedure.handler(async ({ context }) => {
    await db.delete(emailVerifications).where(eq(emailVerifications.user_id, context.user.id));

    const verifyEmailEntry = {
      id: crypto.randomUUID(),
      email: context.user.email,
      user_id: context.user.id,
      time: new Date(),
    };

    await db.insert(emailVerifications).values(verifyEmailEntry);

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
        .update(users)
        .set({ password, passwordType: "bcrypt" })
        .where(eq(users.id, context.user.id));

      await db
        .delete(tokens)
        .where(
          and(
            eq(tokens.user_id, context.user.id),
            ne(tokens.id, context.token.id)
          )
        );

      return context.user;
    }),
};
