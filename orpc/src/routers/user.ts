import * as Sentry from "@sentry/bun";
import { beep, rating, user, verify_email } from "../../drizzle/schema";
import { db } from "../utils/db";
import { count, eq, sql, like, and, or, avg } from "drizzle-orm";
import { z } from "zod";
import { s3 } from "../utils/s3";
import { syncUserPayments } from "../utils/payments";
import { SendMailOptions } from "nodemailer";
import { email } from "../utils/email";
import { sendNotification } from "../utils/notifications";
import { pubSub } from "../utils/pubsub";
import { isAlpha, isMobilePhone } from "validator";
import { inProgressBeep } from "../logic/beep";
import { getUserColumns } from "../logic/user";
import {
  adminProcedure,
  authedProcedure,
  mustHaveBeenInAcceptedBeep,
} from "../utils/trpc";
import {
  DEFAULT_PAGE_SIZE,
  S3_BUCKET_URL,
  WEB_BASE_URL,
} from "../utils/constants";
import { userSchema } from "../schemas/user";
import { eventIterator, ORPCError } from "@orpc/server";

export const userRouter = {
  updates: authedProcedure
    .input(z.string().optional())
    .output(eventIterator(userSchema))
    .handler(async function* ({ context, input, signal }) {
      if (context.user.role === "user" && input && input !== context.user.id) {
        throw new ORPCError(
          "UNAUTHORIZED", {
          message:
            "You don't have permission to subscrbe to another user's user updates.",
        });
      }

      const userId = input ?? context.user.id;

      console.log("➕ User subscribed", userId);

      if (context.user.id === userId) {
        yield context.user;
      } else {
        const user = await db.query.user.findFirst({
          where: { id: userId },
          columns: { password: false, passwordType: false },
        })
        if (user) {
          yield user;
        }
      }

      const eventSource = pubSub.subscribe("user", userId);

      if (signal) {
        signal.onabort = () => {
          console.log("➖ User unsubscribed", userId);
          eventSource.return();
        };
      }

      for await (const { user } of eventSource) {
        if (signal?.aborted) return;
        yield { ...user, created: user.created ? new Date(user.created) : null };
      }
    }),
  edit: authedProcedure
    .input(
      z
        .object({
          first: z.string().refine(isAlpha, "Must be letters only.").min(1),
          last: z.string().refine(isAlpha, "Must be letters only.").min(1),
          email: z
            .string()
            .email()
            .endsWith(".edu", "Email must end with .edu"),
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
        .partial(),
    )
    .handler(async ({ context, input }) => {
      const values: Partial<typeof user.$inferInsert> = input;

      if (values.isBeeping === false) {
        const countOfInProgressBeeps = await db.$count(
          beep,
          and(eq(beep.beeper_id, context.user.id), inProgressBeep),
        );

        if (countOfInProgressBeeps > 0) {
          throw new ORPCError(
             "BAD_REQUEST", {
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
        if (!context.user.isStudent && !context.user.isEmailVerified) {
          throw new ORPCError(
             "UNAUTHORIZED", {
            message: "You must confirm your email to beep.",
          });
        }

        const c = await db.query.car.findFirst({
          where: { user_id: context.user.id, default: true },
        });
        if (!c) {
          throw new ORPCError(
            "BAD_REQUEST", {
            message: "You must have a default car to beep.",
          });
        }
      }

      const u = await db
        .update(user)
        .set(values)
        .where(eq(user.id, context.user.id))
        .returning(getUserColumns());

      pubSub.publish("user", context.user.id, { user: u[0] });

      if (input.location) {
        const data = {
          id: context.user.id,
          location: input.location,
        };

        pubSub.publish("locations", data);
      }

      return u[0];
    }),
  editAdmin: adminProcedure
    .input(
      z.object({
        userId: z.string(),
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
      }),
    )
    .handler(async ({ input }) => {
      const existingUser = await db.query.user.findFirst({
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

      const u = await db
        .update(user)
        .set(input.data)
        .where(eq(user.id, input.userId))
        .returning();

      pubSub.publish("user", u[0].id, { user: u[0] });

      if (u[0].location) {
        const data = {
          id: u[0].id,
          location: u[0].location,
        };

        pubSub.publish("locations", data);
      }

      return u[0];
    }),
  syncMyPayments: authedProcedure.handler(async ({ context }) => {
    return await syncUserPayments(context.user.id);
  }),
  syncPayments: authedProcedure
    .input(z.string())
    .handler(async ({ input }) => {
      return await syncUserPayments(input);
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
        .update(user)
        .set({ photo: S3_BUCKET_URL + objectKey })
        .where(eq(user.id, context.user.id))
        .returning();

      pubSub.publish("user", context.user.id, { user: u[0] });

      return context.user;
    }),
  users: adminProcedure
    .input(
      z.object({
        page: z.number().default(1),
        pageSize: z.number().default(DEFAULT_PAGE_SIZE),
        query: z.string().optional(),
        isBeeping: z.boolean().optional(),
      }),
    )
    .handler(async ({ input }) => {
      const lowercaseQuery = input.query?.toLowerCase();

      const where = and(
        input.isBeeping ? eq(user.isBeeping, true) : undefined,
        input.query
          ? or(
              eq(user.id, input.query),
              like(sql`lower(${user.first})`, `%${lowercaseQuery}%`),
              like(sql`lower(${user.last})`, `%${lowercaseQuery}%`),
              like(sql`lower(${user.email})`, `%${lowercaseQuery}%`),
              like(sql`lower(${user.phone})`, `%${lowercaseQuery}%`),
              like(sql`lower(${user.username})`, `%${lowercaseQuery}%`),
              like(
                sql`lower(${user.first} || ' ' || ${user.last})`,
                `%${lowercaseQuery}%`,
              ),
            )
          : undefined,
      );

      const offset = (input.page - 1) * input.pageSize;

      const [users, usersCount] = await Promise.all([
        db
          .select({
            id: user.id,
            first: user.first,
            last: user.last,
            photo: user.photo,
            email: user.email,
            username: user.username,
            isStudent: user.isStudent,
            isEmailVerified: user.isEmailVerified,
            isBeeping: user.isBeeping,
            created: user.created,
            location: user.location,
            queueSize: user.queueSize,
            groupRate: user.groupRate,
            singlesRate: user.singlesRate,
            capacity: user.capacity,
          })
          .from(user)
          .where(where)
          .orderBy(sql`${user.created} desc nulls last`)
          .limit(input.pageSize)
          .offset(offset),
        db.select({ count: count() }).from(user).where(where),
      ]);

      const results = usersCount[0].count;

      return {
        users,
        page: input.page,
        pages: Math.ceil(results / input.pageSize),
        results,
      };
    }),
  publicUser: authedProcedure.input(z.string()).handler(async ({ input }) => {
    const u = await db.query.user.findFirst({
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
    .input(z.string())
    .use(mustHaveBeenInAcceptedBeep)
    .handler(async ({ input }) => {
      const u = await db.query.user.findFirst({
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
  user: adminProcedure.input(z.string()).handler(async ({ input }) => {
    const u = await db.query.user.findFirst({
      where: { id: input },
      columns: {
        password: false,
        passwordType: false,
      },
    });

    if (!u) {
      throw new ORPCError("NOT_FOUND");
    }

    return u;
  }),
  usersWithBeeps: adminProcedure
    .input(
      z.object({
        page: z.number().default(1),
        pageSize: z.number().default(DEFAULT_PAGE_SIZE),
      }),
    )
    .handler(async ({ input }) => {
      const users = await db
        .select({
          user: {
            id: user.id,
            first: user.first,
            last: user.last,
            photo: user.photo,
          },
          beeps: count(beep.beeper_id).as("beeps"),
        })
        .from(user)
        .leftJoin(beep, eq(user.id, beep.beeper_id))
        .groupBy(user.id)
        .orderBy(sql`beeps desc`)
        .offset((input.page - 1) * input.pageSize)
        .limit(input.pageSize);

      const usersCount = await db.select({ count: count() }).from(user);
      const results = usersCount[0].count;

      return {
        users,
        page: input.page,
        pages: Math.ceil(results / input.pageSize),
        pageSize: input.pageSize,
        results,
      };
    }),
  usersWithRides: adminProcedure
    .input(
      z.object({
        page: z.number().default(1),
        pageSize: z.number().default(DEFAULT_PAGE_SIZE),
      }),
    )
    .handler(async ({ input }) => {
      const users = await db
        .select({
          user: {
            id: user.id,
            first: user.first,
            last: user.last,
            photo: user.photo,
          },
          rides: count(beep.rider_id).as("rides"),
        })
        .from(user)
        .leftJoin(beep, eq(user.id, beep.rider_id))
        .groupBy(user.id)
        .orderBy(sql`rides desc`)
        .offset((input.page - 1) * input.pageSize)
        .limit(input.pageSize);

      const usersCount = await db.select({ count: count() }).from(user);
      const results = usersCount[0].count;

      return {
        users,
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
      .from(user)
      .groupBy(sql`domain`)
      .orderBy(sql`count desc`);
  }),
  deleteMyAccount: authedProcedure.handler(async ({ context }) => {
    if (context.user.role === "admin") {
      throw new ORPCError("BAD_REQUEST", {
        message: "Admins can't delete their own accounts.",
      });
    }

    await db.delete(user).where(eq(user.id, context.user.id));
  }),
  deleteUser: adminProcedure.input(z.string()).handler(async ({ input }) => {
    await db.delete(user).where(eq(user.id, input));
  }),
  reconcileUserRatings: adminProcedure.handler(async () => {
    await db.update(user).set({ rating: null });

    const ratings = await db
      .select({
        userId: rating.rated_id,
        avgRating: avg(rating.stars),
      })
      .from(rating)
      .groupBy(rating.rated_id);

    if (!ratings) {
      throw new Error("No ratings!");
    }

    for (const { userId, avgRating } of ratings) {
      await db
        .update(user)
        .set({ rating: avgRating })
        .where(eq(user.id, userId));
    }

    return ratings.length;
  }),
  getUsersDefaultCar: authedProcedure
    .input(z.string())
    .use(mustHaveBeenInAcceptedBeep)
    .handler(async ({ input }) => {
      const c = await db.query.car.findFirst({
        where: { user_id: input, default: true },
      });

      if (!c) {
        throw new ORPCError("NOT_FOUND");
      }

      return c;
    }),
  sendTestEmail: adminProcedure
    .input(z.object({ userId: z.uuid() }))
    .handler(async ({ input }) => {
      const user = await db.query.user.findFirst({
        where: { id: input.userId },
        columns: { email: true, username: true },
      });

      if (!user) {
        throw new ORPCError("NOT_FOUND");
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
