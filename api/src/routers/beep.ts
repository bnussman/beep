import { z } from "zod";
import { adminProcedure, authedProcedure, publicProcedure, router } from "../utils/trpc";
import { db } from "../utils/db";
import { count, desc, eq, or, and } from "drizzle-orm";
import { beep, user } from "../../drizzle/schema";
import { TRPCError } from "@trpc/server";
import { PushNotification, sendNotifications } from "../utils/notifications";
import { pubSub } from "../utils/pubsub";
import { inProgressBeep } from "../utils/beep";

export const beepRouter = router({
  beeps: authedProcedure
    .input(
      z.object({
        cursor: z.number().optional(),
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
        offset: input.cursor ?? 0,
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
              venmo: true,
              groupRate: true,
              singlesRate: true,
            },
          },
          rider: {
            columns: {
              id: true,
              first: true,
              last: true,
              photo: true,
              venmo: true,
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
        pubSub.publishRiderUpdate(beep.rider.id, null);

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

      const u = await db
        .update(user)
        .set({
          ...(input.stopBeeping ? { isBeeping: false } : {}),
          queueSize: 0
        })
        .where(eq(user.id, beeper.id))
        .returning();

      pubSub.publishUserUpdate(beeper.id, u[0]);
      pubSub.publishBeeperQueue(beeper.id, []);
    }),
    beepsCount: publicProcedure.query(async () => {
      const beepsCount = await db.select({ count: count() }).from(beep);
      return beepsCount[0].count;
    })
});
