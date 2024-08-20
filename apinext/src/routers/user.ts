import { observable } from "@trpc/server/observable";
import { adminProcedure, authedProcedure, router } from "../utils/trpc";
import { beep, user } from '../../drizzle/schema';
import { redis, redisSubscriber } from "../utils/redis";
import { db } from "../utils/db";
import { count, eq, desc, sql } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { s3 } from "../utils/s3";
import { S3_BUCKET_URL } from "../utils/constants";

export const userRouter = router({
  me: authedProcedure.query(async ({ ctx }) => {
    return ctx.user;
  }),
  updates: authedProcedure.subscription(({ ctx }) => {
    // return an `observable` with a callback which is triggered immediately
    return observable<typeof ctx.user>((emit) => {
      const onUserUpdate = (message: string) => {
        // emit data to client
        console.log("Emitting to WS", message);
        emit.next(JSON.parse(message));
      };
      // trigger `onAdd()` when `add` is triggered in our event emitter
      const listener = (message: string) => onUserUpdate(message);
      redisSubscriber.subscribe(`user-${ctx.user.id}`, listener);
      (async () => emit.next(ctx.user))();
      // unsubscribe function when client disconnects or stops subscribing
      return () => {
        redisSubscriber.unsubscribe(`user-${ctx.user.id}`, listener);
      };
    });
  }),
  edit: authedProcedure
    .input(
      z.object({
        first: z.string(),
        last: z.string(),
        email: z.string().endsWith('.edu', 'Email must end with .edu'),
        phone: z.string(),
        venmo: z.string().nullable(),
        cashapp: z.string().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const u = await db
        .update(user)
        .set(input)
        .where(eq(user.id, ctx.user.id))
        .returning();

      redis.publish(`user-${ctx.user.id}`, JSON.stringify(u[0]))

      return u[0];
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
        error
      } = signupSchema.safeParse({
        photo: formData.get("photo")
      });

      if (!success) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          cause: error,
        });
      }

      const extention = input.photo.name.substring(
        input.photo.name.lastIndexOf("."),
        input.photo.name.length
      );

      const filename = ctx.user.id + "-" + Date.now() + extention;

      const objectKey = "images/" + filename;

      await s3.putObject(
        objectKey,
        input.photo.stream(),
        { metadata: { "x-amz-acl": "public-read" } }
      );

      if (ctx.user.photo) {
        const key = ctx.user.photo.split(S3_BUCKET_URL)[1];

        s3.deleteObject(key);
      }

      const u = await db
        .update(user)
        .set({ photo: S3_BUCKET_URL + objectKey })
        .where(eq(user.id, ctx.user.id))
        .returning();

      redis.publish(`user-${ctx.user.id}`, JSON.stringify(u[0]));

      return ctx.user;
    }),
  users: adminProcedure
    .input(
      z.object({
        offset: z.number(),
        show: z.number(),
        query: z.string().optional(),
        isBeeping: z.boolean().optional()
      })
    )
    .query(async ({ input }) => {
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
        .where(input.isBeeping ? eq(user.isBeeping, true) : undefined)
        .orderBy(sql`${user.created} desc nulls last`)
        .limit(input.show)
        .offset(input.offset);

      const usersCount = await db.select({ count: count() })
        .from(user)
        .where(input.isBeeping ? eq(user.isBeeping, true) : undefined);

      return {
        users,
        count: usersCount[0].count
      };
    }),
  usersWithBeeps: adminProcedure
    .input(
      z.object({
        offset: z.number(),
        show: z.number(),
      })
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
          beeps: count(beep.beeper_id).as('beeps')
        })
        .from(user)
        .leftJoin(beep, eq(user.id, beep.beeper_id))
        .groupBy(user.id)
        .orderBy(sql`beeps desc`)
        .offset(input.offset)
        .limit(input.show);

      const usersCount = await db.select({ count: count() }).from(user);

      return {
        users,
        count: usersCount[0].count
      };
    }),
  usersWithRides: adminProcedure
    .input(
      z.object({
        offset: z.number(),
        show: z.number(),
      })
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
          rides: count(beep.rider_id).as('rides')
        })
        .from(user)
        .leftJoin(beep, eq(user.id, beep.rider_id))
        .groupBy(user.id)
        .orderBy(sql`rides desc`)
        .offset(input.offset)
        .limit(input.show);

      const usersCount = await db.select({ count: count() }).from(user);

      return {
        users,
        count: usersCount[0].count
      };
    })
})
