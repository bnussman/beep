import { adminProcedure, authedProcedure, router } from "../utils/trpc";
import { beep, car, rating, user, verify_email } from "../../drizzle/schema";
import { db } from "../utils/db";
import { count, eq, sql, like, and, or, avg } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { s3 } from "../utils/s3";
import {
  DEFAULT_PAGE_SIZE,
  S3_BUCKET_URL,
  WEB_BASE_URL,
} from "../utils/constants";
import { syncUserPayments } from "../utils/payments";
import { SendMailOptions } from "nodemailer";
import { email } from "../utils/email";
import * as Sentry from "@sentry/bun";
import { sendNotification } from "../utils/notifications";
import { pubSub } from "../utils/pubsub";
import { isAlpha, isMobilePhone } from "validator";
import { inProgressBeep } from "../logic/beep";
import { getUserColumns } from "../logic/user";

export const userRouter = router({
  me: authedProcedure.query(async ({ ctx }) => {
    return ctx.user;
  }),
  updates: authedProcedure
    .input(z.string().optional())
    .subscription(async function* ({ ctx, input, signal }) {
      if (ctx.user.role === "user" && input && input !== ctx.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message:
            "You don't have permission to subscrbe to another user's user updates.",
        });
      }

      const userId = input ?? ctx.user.id;

      console.log("➕ User subscribed", userId);

      if (ctx.user.id === userId) {
        yield ctx.user;
      } else {
        yield await db.query.user.findFirst({
          where: eq(user.id, userId),
          columns: { password: false, passwordType: false },
        });
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
        yield user;
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
    .mutation(async ({ ctx, input }) => {
      const values: Partial<typeof user.$inferInsert> = input;

      if (values.isBeeping === false) {
        const countOfInProgressBeeps = await db.$count(
          beep,
          and(eq(beep.beeper_id, ctx.user.id), inProgressBeep),
        );

        if (countOfInProgressBeeps > 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "You can't stop beeping when you have riders in your queue",
          });
        }
      }

      if (input.email && input.email !== ctx.user.email) {
        // User is changing their email, we must make them reverify.
        values.isEmailVerified = false;
        values.isEmailVerified = false;

        await db
          .delete(verify_email)
          .where(eq(verify_email.user_id, ctx.user.id));

        const verifyEmailEntry = {
          id: crypto.randomUUID(),
          email: input.email,
          user_id: ctx.user.id,
          time: new Date(),
        };

        await db.insert(verify_email).values(verifyEmailEntry);

        const mailOptions: SendMailOptions = {
          from: "Beep App <banks@ridebeep.app>",
          to: input.email,
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
      }

      if (input.isBeeping) {
        if (!ctx.user.isStudent && !ctx.user.isEmailVerified) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must confirm your email to beep.",
          });
        }

        const c = await db.query.car.findFirst({
          where: and(eq(car.user_id, ctx.user.id), eq(car.default, true)),
        });
        if (!c) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "You must have a default car to beep.",
          });
        }
      }

      const u = await db
        .update(user)
        .set(values)
        .where(eq(user.id, ctx.user.id))
        .returning(getUserColumns());

      pubSub.publish("user", ctx.user.id, { user: u[0] });

      if (input.location) {
        const data = {
          id: ctx.user.id,
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
    .mutation(async ({ input }) => {
      const existingUser = await db.query.user.findFirst({
        where: eq(user.id, input.userId),
        columns: {
          isEmailVerified: true,
          pushToken: true,
          photo: true,
        },
      });

      if (!existingUser) {
        throw new TRPCError({ code: "NOT_FOUND" });
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
  syncMyPayments: authedProcedure.mutation(async ({ ctx }) => {
    return await syncUserPayments(ctx.user.id);
  }),
  syncPayments: authedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return await syncUserPayments(input);
    }),
  updatePicture: authedProcedure
    .input(z.instanceof(FormData))
    .mutation(async ({ ctx, input: formData }) => {
      const signupSchema = z.object({
        photo: z.instanceof(File),
      });

      const {
        success,
        data: input,
        error,
      } = signupSchema.safeParse({
        photo: formData.get("photo"),
      });

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

      const filename = ctx.user.id + "-" + Date.now() + extention;

      const objectKey = "images/" + filename;

      await s3.write(objectKey, input.photo, { acl: "public-read" });

      if (ctx.user.photo) {
        const key = ctx.user.photo.split(S3_BUCKET_URL)[1];

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
        .where(eq(user.id, ctx.user.id))
        .returning();

      pubSub.publish("user", ctx.user.id, { user: u[0] });

      return ctx.user;
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
    .query(async ({ input }) => {
      const where = and(
        input.isBeeping ? eq(user.isBeeping, true) : undefined,
        input.query
          ? or(
              eq(user.id, input.query),
              like(user.first, input.query),
              like(user.last, input.query),
              like(user.email, input.query),
              like(user.username, input.query),
            )
          : undefined,
      );

      const offset = (input.page - 1) * input.pageSize;

      const users = await db
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
        .offset(offset);

      const usersCount = await db
        .select({ count: count() })
        .from(user)
        .where(where);

      const results = usersCount[0].count;

      return {
        users,
        page: input.page,
        pages: Math.ceil(results / input.pageSize),
        results,
      };
    }),
  user: authedProcedure.input(z.string()).query(async ({ input, ctx }) => {
    const u = await db.query.user.findFirst({
      where: eq(user.id, input),
      columns: {
        password: false,
        passwordType: false,
      },
    });

    if (!u) {
      throw new TRPCError({ code: "NOT_FOUND" });
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
    .query(async ({ input }) => {
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
    .query(async ({ input }) => {
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
  usersByDomain: adminProcedure.query(async () => {
    return await db
      .select({
        domain: sql<string>`substring(email from '@(.*)$')`.as("domain"),
        count: count(),
      })
      .from(user)
      .groupBy(sql`domain`)
      .orderBy(sql`count desc`);
  }),
  deleteMyAccount: authedProcedure.mutation(async ({ ctx }) => {
    if (ctx.user.role === "admin") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Admins can't delete their own accounts.",
      });
    }

    await db.delete(user).where(eq(user.id, ctx.user.id));
  }),
  deleteUser: adminProcedure.input(z.string()).mutation(async ({ input }) => {
    await db.delete(user).where(eq(user.id, input));
  }),
  reconcileUserRatings: adminProcedure.mutation(async () => {
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
});
