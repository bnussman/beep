import * as Sentry from "@sentry/bun";
import { beep, users, verify_email } from "../../../drizzle/schema";
import { db, writeDB } from "../../utils/db";
import { count, eq, sql, like, and, or } from "drizzle-orm";
import { z } from "zod";
import { s3 } from "../../utils/s3";
import { syncUserPayments } from "../../utils/payments";
import { SendMailOptions } from "nodemailer";
import { email } from "../../utils/email";
import { sendNotification } from "../../utils/notifications";
import { pubSub } from "../../utils/pubsub";
import { inProgressBeep, updateEta } from "../beeps/logic";
import { asyncIteratorObject, ORPCError } from "@orpc/server";
import { activePaymentsInputSchema, adminEditUserInputSchema, editUserInputSchema, listsUsersInputSchema, listsUsersWithBeepsInputSchema, listsUsersWithRidesInputSchema, sendTestEmailInputSchema, syncUserPaymentsInputSchema, userSchema } from "./schemas";
import { getActivePayments } from "../payments/logic";
import {
  adminProcedure,
  authedProcedure,
  mustHaveBeenInAcceptedBeep,
} from "../../utils/orpc";
import {
  S3_BUCKET_URL,
  WEB_BASE_URL,
} from "../../utils/constants";

export const userRouter = {
  me: authedProcedure
    .output(userSchema)
    .handler(({ context }) => {
      return context.user;
    }),
  updates: authedProcedure
    .input(z.uuid().optional())
    .output(asyncIteratorObject(userSchema))
    .handler(async function* ({ context, input, signal }) {
      if (context.user.role === "user" && input && input !== context.user.id) {
        throw new ORPCError( "UNAUTHORIZED", {
          message:
            "You don't have permission to subscrbe to another user's user updates.",
        });
      }

      const userId = input ?? context.user.id;

      console.log("➕ User subscribed", userId);

      if (context.user.id === userId) {
        yield context.user;
      } else {
        const user = await db.query.users.findFirst({
          where: { id: userId },
          columns: { password: false, passwordType: false },
        })

        if (!user) {
          throw new ORPCError('NOT_FOUND');
        }
        yield user;
      }

      const iterator = pubSub.subscribe(`user-${userId}`, { signal });

      if (signal) {
        signal.onabort = () => {
          console.log("➖ User unsubscribed", userId);
        };
      }

      for await (const { user } of iterator) {
        yield user;
      }
    }),
  edit: authedProcedure
    .input(editUserInputSchema)
    .handler(async ({ context, input }) => {
      const values: Partial<typeof users.$inferInsert> = input;

      if (values.isBeeping === false) {
        const countOfInProgressBeeps = await db.$count(
          beep,
          and(eq(beep.beeper_id, context.user.id), inProgressBeep),
        );

        if (countOfInProgressBeeps > 0) {
          throw new ORPCError("BAD_REQUEST", {
            message:
              "You can't stop beeping when you have riders in your queue",
          });
        }
      }

      if (input.email && input.email !== context.user.email) {
        // User is changing their email, we must make them reverify.
        values.isEmailVerified = false;
        values.isEmailVerified = false;

        await db
          .delete(verify_email)
          .where(eq(verify_email.user_id, context.user.id));

        const verifyEmailEntry = {
          id: crypto.randomUUID(),
          email: input.email,
          user_id: context.user.id,
          time: new Date(),
        };

        await db.insert(verify_email).values(verifyEmailEntry);

        const mailOptions: SendMailOptions = {
          from: "Beep App <banks@ridebeep.app>",
          to: input.email,
          subject: "Verify your Beep App Email!",
          html: `Hey ${context.user.username}, <br><br>
                  Head to ${WEB_BASE_URL}/account/verify/${verifyEmailEntry.id} to verify your email. This link will expire in 5 hours. <br><br>
                  - Beep App Team
              `,
        };

        try {
          await email.sendMail(mailOptions);
        } catch (error) {
          Sentry.captureException(error);
        }
      }

      if (input.isBeeping) {
        if (!context.user.isEmailVerified) {
          throw new ORPCError("UNAUTHORIZED", {
            message: "You must confirm your email to beep.",
          });
        }

        const car = await db.query.cars.findFirst({
          where: { user_id: context.user.id, default: true },
        });

        if (!car) {
          throw new ORPCError("BAD_REQUEST", {
            message: "You must have a default car to beep.",
          });
        }
      }

      if ("location" in values) {
        await writeDB.update(users).set(values).where(eq(users.id, context.user.id));
      } else {
        await db
          .update(users)
          .set(values)
          .where(eq(users.id, context.user.id));
      }

      Object.assign(context.user, values);

      pubSub.publish(`user-${context.user.id}`, { user: context.user });

      if (input.location) {
        const data = {
          id: context.user.id,
          location: input.location,
        };

        updateEta(context.user.id, input.location);

        pubSub.publish("locations", data);
      }

      return context.user;
    }),
  editAdmin: adminProcedure
    .input(adminEditUserInputSchema)
    .handler(async ({ input }) => {
      const existingUser = await db.query.users.findFirst({
        where: { id: input.userId },
        columns: {
          isEmailVerified: true,
          pushToken: true,
          photo: true,
        },
      });

      if (!existingUser) {
        throw new ORPCError("NOT_FOUND");
      }

      if (
        !existingUser.isEmailVerified &&
        input.data.isEmailVerified &&
        existingUser.pushToken
      ) {
        sendNotification({
          to: existingUser.pushToken,
          title: "Account Verified ✅",
          body: "An admin has approved your account.",
        });
      }

      if (
        input.data.photo &&
        existingUser.photo &&
        existingUser.photo !== input.data.photo
      ) {
        // If an admin changes a user's photo URL, delete the old photo from S3
        // to prevent storing unreferenced images.
        await s3.delete(existingUser.photo);
      }

      const [user] = await db
        .update(users)
        .set(input.data)
        .where(eq(users.id, input.userId))
        .returning();

      pubSub.publish(`user-${user.id}`, { user });

      if (user.location) {
        const data = {
          id: user.id,
          location: user.location,
        };

        updateEta(input.userId, data.location);

        pubSub.publish("locations", data);
      }

      return user;
    }),
  syncPayments: authedProcedure
    .input(syncUserPaymentsInputSchema)
    .handler(async ({ context, input }) => {
      const userId = input?.userId ?? context.user.id;

      if (context.user.role === "user" && userId !== context.user.id) {
        throw new ORPCError("UNAUTHORIZED", {
          message: "You must be an admin to sync purchases for other users.",
        });
      }

      return await syncUserPayments(userId);
    }),
  activePayments: authedProcedure
    .input(activePaymentsInputSchema)
    .handler(async ({ context, input }) => {
      const userId = input?.userId ?? context.user.id;

      if (context.user.role === "user" && userId !== context.user.id) {
        throw new ORPCError("UNAUTHORIZED", {
          message:
            "You must be an admin to get active payments for other users.",
        });
      }

      return await getActivePayments(context.user.id);
    }),
  updatePicture: authedProcedure
    .input(z.instanceof(File))
    .handler(async ({ context, input }) => {

      const extention = input.name.substring(
        input.name.lastIndexOf("."),
        input.name.length,
      );

      const filename = context.user.id + "-" + Date.now() + extention;

      const objectKey = "images/" + filename;

      await s3.write(objectKey, input, { acl: "public-read" });

      if (context.user.photo) {
        const key = context.user.photo.split(S3_BUCKET_URL)[1];

        if (key) {
          s3.delete(key);
        } else {
          Sentry.captureMessage(
            "Unable to delete profile photo from S3 due to invalid URL format",
          );
        }
      }

      const u = await db
        .update(users)
        .set({ photo: S3_BUCKET_URL + objectKey })
        .where(eq(users.id, context.user.id))
        .returning();

      pubSub.publish(`user-${context.user.id}`, { user: u[0] });

      return context.user;
    }),
  users: adminProcedure
    .input(listsUsersInputSchema)
    .handler(async ({ input }) => {
      const lowercaseQuery = input.query?.toLowerCase();

      const where = and(
        input.isBeeping ? eq(users.isBeeping, true) : undefined,
        input.query
          ? or(
              eq(users.id, input.query),
              like(sql`lower(${users.first})`, `%${lowercaseQuery}%`),
              like(sql`lower(${users.last})`, `%${lowercaseQuery}%`),
              like(sql`lower(${users.email})`, `%${lowercaseQuery}%`),
              like(sql`lower(${users.phone})`, `%${lowercaseQuery}%`),
              like(sql`lower(${users.username})`, `%${lowercaseQuery}%`),
              like(
                sql`lower(${users.first} || ' ' || ${users.last})`,
                `%${lowercaseQuery}%`,
              ),
            )
          : undefined,
      );

      const offset = (input.page - 1) * input.pageSize;

      const [usersData, usersCount] = await Promise.all([
        db
          .select({
            id: users.id,
            first: users.first,
            last: users.last,
            photo: users.photo,
            email: users.email,
            username: users.username,
            isStudent: users.isStudent,
            isEmailVerified: users.isEmailVerified,
            isBeeping: users.isBeeping,
            created: users.created,
            location: users.location,
            queueSize: users.queueSize,
            groupRate: users.groupRate,
            singlesRate: users.singlesRate,
            capacity: users.capacity,
          })
          .from(users)
          .where(where)
          .orderBy(sql`${users.created} desc nulls last`)
          .limit(input.pageSize)
          .offset(offset),
        db.select({ count: count() }).from(users).where(where),
      ]);

      const results = usersCount[0].count;

      return {
        users: usersData,
        page: input.page,
        pages: Math.ceil(results / input.pageSize),
        results,
      };
    }),
  publicUser: authedProcedure
    .input(z.uuid())
    .handler(async ({ input }) => {
      const u = await db.query.users.findFirst({
        where: { id: input },
        columns: {
          id: true,
          first: true,
          last: true,
          photo: true,
          username: true,
          venmo: true,
          cashapp: true,
          singlesRate: true,
          groupRate: true,
          capacity: true,
          isBeeping: true,
          rating: true,
        },
      });

      if (!u) {
        throw new ORPCError("NOT_FOUND");
      }

      return u;
    }),
  getUserPrivateDetails: authedProcedure
    .input(z.uuid())
    .use(mustHaveBeenInAcceptedBeep)
    .handler(async ({ input }) => {
      const u = await db.query.users.findFirst({
        where: { id: input },
        columns: {
          phone: true,
        },
      });

      if (!u) {
        throw new ORPCError("NOT_FOUND");
      }

      return u;
    }),
  user: adminProcedure
    .input(z.uuid())
    .handler(async ({ input }) => {
      const u = await db.query.users.findFirst({
        where: { id: input },
        columns: {
          password: false,
          passwordType: false,
          pushToken: false,
        },
      });

      if (!u) {
        throw new ORPCError("NOT_FOUND");
      }

      return u;
    }),
  usersWithBeeps: adminProcedure
    .input(listsUsersWithBeepsInputSchema)
    .handler(async ({ input }) => {
      const usersData = await db
        .select({
          user: {
            id: users.id,
            first: users.first,
            last: users.last,
            photo: users.photo,
          },
          beeps: count(beep.beeper_id).as("beeps"),
        })
        .from(users)
        .leftJoin(beep, eq(users.id, beep.beeper_id))
        .groupBy(users.id)
        .orderBy(sql`beeps desc`)
        .offset((input.page - 1) * input.pageSize)
        .limit(input.pageSize);

      const usersCount = await db.select({ count: count() }).from(users);
      const results = usersCount[0].count;

      return {
        users: usersData,
        page: input.page,
        pages: Math.ceil(results / input.pageSize),
        pageSize: input.pageSize,
        results,
      };
    }),
  usersWithRides: adminProcedure
    .input(listsUsersWithRidesInputSchema)
    .handler(async ({ input }) => {
      const usersData = await db
        .select({
          user: {
            id: users.id,
            first: users.first,
            last: users.last,
            photo: users.photo,
          },
          rides: count(beep.rider_id).as("rides"),
        })
        .from(users)
        .leftJoin(beep, eq(users.id, beep.rider_id))
        .groupBy(users.id)
        .orderBy(sql`rides desc`)
        .offset((input.page - 1) * input.pageSize)
        .limit(input.pageSize);

      const usersCount = await db.select({ count: count() }).from(users);
      const results = usersCount[0].count;

      return {
        users: usersData,
        results,
        page: input.page,
        pages: Math.ceil(results / input.pageSize),
        pageSize: input.pageSize,
      };
    }),
  usersByDomain: adminProcedure.handler(async () => {
    return await db
      .select({
        domain: sql<string>`substring(email from '@(.*)$')`.as("domain"),
        count: count(),
      })
      .from(users)
      .groupBy(sql`domain`)
      .orderBy(sql`count desc`);
  }),
  deleteMyAccount: authedProcedure
    .handler(async ({ context }) => {
      if (context.user.role === "admin") {
        throw new ORPCError("BAD_REQUEST", {
          message: "Admins can't delete their own accounts.",
        });
      }

      await db.delete(users).where(eq(users.id, context.user.id));
    }),
  deleteUser: adminProcedure
    .input(z.uuid())
    .handler(async ({ input }) => {
      await db.delete(users).where(eq(users.id, input));
    }),
  getUsersDefaultCar: authedProcedure
    .input(z.uuid())
    .use(mustHaveBeenInAcceptedBeep)
    .handler(async ({ input }) => {
      const car = await db.query.cars.findFirst({
        where: { user_id: input, default: true },
      });

      if (!car) {
        throw new ORPCError("NOT_FOUND");
      }

      return car;
    }),
  sendTestEmail: adminProcedure
    .input(sendTestEmailInputSchema)
    .handler(async ({ input }) => {
      const user = await db.query.users.findFirst({
        where: { id: input.userId },
        columns: { email: true, username: true, role: true },
      });

      if (!user) {
        throw new ORPCError("NOT_FOUND");
      }

      if (user.role !== "admin") {
        throw new ORPCError("BAD_REQUEST", {
          message: "Can only send test emails to admins.",
        });
      }

      const mailOptions: SendMailOptions = {
        from: "Beep App <banks@ridebeep.app>",
        to: user.email,
        subject: "Beep App Test Email",
        html: `Hey ${user.username}, <br><br>
        This is a test email!<br><br>
        - Beep App Team
        `,
      };

      await email.sendMail(mailOptions);
    }),
};
