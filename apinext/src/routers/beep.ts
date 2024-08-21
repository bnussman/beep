import { z } from "zod";
import { adminProcedure, router } from "../utils/trpc";
import { db } from "../utils/db";
import { count, desc, eq, or, and } from "drizzle-orm";
import { beep, user } from "../../drizzle/schema";
import { TRPCError } from "@trpc/server";
import { PushNotification, sendNotifications } from "../utils/notifications";
import { redis } from "../utils/redis";

const inProgressBeep = or(
  eq(beep.status, "waiting"),
  eq(beep.status, "accepted"),
  eq(beep.status, "here"),
  eq(beep.status, "in_progress"),
  eq(beep.status, "on_the_way"),
);

export const beepRouter = router({
  beeps: adminProcedure
    .input(
      z.object({
        offset: z.number(),
        show: z.number(),
        inProgress: z.boolean().optional(),
        userId: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const where = and(
        input.inProgress ? inProgressBeep : undefined,
        input.userId ? or(eq(beep.rider_id, input.userId), eq(beep.beeper_id, input.userId)) : undefined,
      );

      const beeps = await db.query.beep.findMany({
        offset: input.offset,
        limit: input.show,
        where,
        orderBy: desc(beep.start),
        with: {
          beeper: {
            columns: {
              id: true,
              first: true,
              last: true,
              photo: true,
            },
          },
          rider: {
            columns: {
              id: true,
              first: true,
              last: true,
              photo: true,
            },
          },
        },
      });

      const beepsCount = await db
        .select({ count: count() })
        .from(beep)
        .where(where);

      return {
        beeps,
        count: beepsCount[0].count
      };
    }),
  beep: adminProcedure
     .input(z.string())
     .query(async ({ input }) => {
       const b = await db.query.beep.findFirst({
         where: eq(beep.id, input),
         with: {
           beeper: {
             columns: {
               id: true,
               first: true,
               last: true,
               photo: true,
             },
           },
           rider: {
             columns: {
               id: true,
               first: true,
               last: true,
               photo: true,
             },
           },
         },
       });

       if (!b) {
         throw new TRPCError({
           code: "NOT_FOUND",
           message: "Beep not found"
         });
       }

       return b;
     }),
  deleteBeep: adminProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      await db.delete(beep).where(eq(beep.id, input));
    }),
  clearQueue: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        stopBeeping: z.boolean()
      })
    )
    .mutation(async ({ input }) => {
      const beeper = await db.query.user.findFirst({
        where: and(
          eq(user.id, input.userId),
        ),
        with: {
          beeps: {
            where: inProgressBeep,
            with: {
              rider: true,
            },
          }
        }
      });

      if (!beeper) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found."
        });
      }

      if (beeper?.beeps.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User's queue is already empty."
        });
      }

      await db.update(beep)
        .set({ status: 'canceled' })
        .where(
          and(
            eq(beep.beeper_id, beeper.id),
            inProgressBeep,
          )
        );

      const notifications: PushNotification[] = [];

      for (const beep of beeper.beeps) {
        // @todo send rider an update that they are no longer in a beep
        redis.publish(`rider-${beep.rider.id}`, JSON.stringify(null));

        if (beep.rider.pushToken) {
          notifications.push({
            to: beep.rider.pushToken,
            title: 'You are no longer getting a ride!',
            body: "An admin cleared your beeper's queue probably because they were inactive."
          });
        }
      }

      if (beeper.pushToken) {
        notifications.push({
          to: beeper.pushToken,
          title: 'Your queue has been cleared',
          body: 'An admin has cleared your queue probably because you were inactive!'
        });
      }

      sendNotifications(notifications);

      if (input.stopBeeping) {
        const u = await db.update(user).set({ isBeeping: false, queueSize: 0 }).where(eq(user.id, beeper.id)).returning();

        // @todo can we publish a partial user?
        redis.publish(`user-${beeper.id}`, JSON.stringify(u[0]));
      } else {
        await db.update(user).set({ queueSize: 0 }).where(eq(user.id, beeper.id)).returning();

        // @todo Send update to empty the user's queue
        redis.publish(`queue-${beeper.id}`, JSON.stringify([]));
      }

    }),
});
