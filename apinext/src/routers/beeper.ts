import { z } from "zod";
import { authedProcedure, router } from "../utils/trpc";
import { db } from "../utils/db";
import { inProgressBeep } from "./beep";
import { and, asc, eq } from "drizzle-orm";
import { beep, car, user } from "../../drizzle/schema";
import { observable } from "@trpc/server/observable";
import { redis, redisSubscriber } from "../utils/redis";
import { TRPCError } from "@trpc/server";
import { sendNotification } from "../utils/notifications";
import { getPositionInQueue, getQueueSize } from "./rider";
import * as Sentry from '@sentry/bun';

export const beeperRouter = router({
  queue: authedProcedure
    .input(z.string().optional())
    .query(async ({ input, ctx }) => {
      return getBeeperQueue(input ?? ctx.user.id);
    }),
  watchQueue: authedProcedure
    .input(z.string().optional())
    .subscription(({ ctx, input }) => {
    // return an `observable` with a callback which is triggered immediately
    return observable<Awaited<ReturnType<typeof getBeeperQueue>>>((emit) => {
      const onUserUpdate = (message: string) => {
        // emit data to client
        emit.next(JSON.parse(message));
      };
      // trigger `onAdd()` when `add` is triggered in our event emitter
      const listener = (message: string) => onUserUpdate(message);
      redisSubscriber.subscribe(`beeper-${input ?? ctx.user.id}`, listener);
      (async () => {
        const ride = await getBeeperQueue(input ?? ctx.user.id);
        emit.next(ride);
      })();
      // unsubscribe function when client disconnects or stops subscribing
      return () => {
        redisSubscriber.unsubscribe(`beeper-${input ?? ctx.user.id}`, listener);
      };
    });
  }),
  updateBeep: authedProcedure
    .input(
      z.object({
        beepId: z.string(),
        data: z.object({
          status: z.enum([ "canceled", "denied", "waiting", "accepted", "on_the_way", "here", "in_progress", "complete", ])
        })
      })
    )
    .mutation(async ({ input, ctx }) => {
      const queue = await getBeeperQueue(ctx.user.id);

      const queueEntry = queue.find((entry) => entry.id === input.beepId);

      if (!queueEntry) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Can't find that beep."
        });
      }

      const isAcceptingOrDenying =
        input.data.status === "accepted" || input.data.status === "denied";

      const numRidersBefore =
        isAcceptingOrDenying ?
          queue.filter((entry) => entry.start < queueEntry.start && entry.status === "waiting").length :
          queue.filter((entry) => entry.start < queueEntry.start && entry.status !== "waiting").length;

      if (numRidersBefore !== 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You must respond to the rider who first joined your queue."
        });
      }

      await db
        .update(beep)
        .set({ status: input.data.status })
        .where(eq(beep.id, queueEntry.id));

      queueEntry.status = input.data.status;

      if (input.data.status === "accepted") {
        ctx.user.queueSize = getQueueSize(queue);

        await db
          .update(user)
          .set({ queueSize: getQueueSize(queue) })
          .where(eq(user.id, ctx.user.id));
      }

      if (input.data.status === "denied" || input.data.status === "complete") {
        redis.publish(`rider-${queueEntry.rider_id}`, JSON.stringify(null));

        ctx.user.queueSize = getQueueSize(queue);

        queueEntry.end = new Date();


        await db
          .update(user)
          .set({ queueSize: getQueueSize(queue) })
          .where(eq(user.id, ctx.user.id));

        await db
          .update(beep)
          .set({ end: new Date() })
          .where(eq(beep.id, queueEntry.id));
      }

      if (queueEntry.rider.pushToken) {
        switch (queueEntry.status) {
          case "denied":
            sendNotification({
              to: queueEntry.rider.pushToken,
              title: `${ctx.user.first} ${ctx.user.last} has denied your beep request 🚫`,
              body: "Open your app to find a diffrent beeper"
            });
            break;
          case "accepted":
            sendNotification({
              to: queueEntry.rider.pushToken,
              title: `${ctx.user.first} ${ctx.user.last} has accepted your beep request ✅`,
              body: "You will recieve another notification when they are on their way to pick you up"
            });
            break;
          case "on_the_way":
            sendNotification({
              to: queueEntry.rider.pushToken,
              title: `${ctx.user.first} ${ctx.user.last} is on their way 🚕`,
              body: `Your beeper is on their way in a ${queueEntry.beeper.cars[0]?.color} ${queueEntry.beeper.cars[0]?.make} ${queueEntry.beeper.cars[0]?.model}`
            });
            break;
          case "here":
            sendNotification({
              to: queueEntry.rider.pushToken,
              title: `${ctx.user.first} ${ctx.user.last} is here 📍`,
              body: `Look for a ${queueEntry.beeper.cars[0]?.color} ${queueEntry.beeper.cars[0]?.make} ${queueEntry.beeper.cars[0]?.model}`
            });
            break;
          case "in_progress":
            // Beep is in progress - no notification needed at this stage.
            break;
          case "complete":
            // Beep is complete.
            break;
          default:
            Sentry.captureException("Our beeper's state notification switch statement reached a point that is should not have");
        }
      }

      const newQueue = queue.filter((beep) => beep.status !== "complete" && beep.status !== 'denied' && beep.status !== "canceled");

      redis.publish(`beeper-${ctx.user.id}`, JSON.stringify(newQueue));

      for (const entry of newQueue) {
        redis.publish(
          `rider-${entry.rider_id}`,
          JSON.stringify({ ...entry, position: getPositionInQueue(queue, entry) })
        );
      }

      return newQueue;
    })
});


async function getBeeperQueue(beeperId: string) {
  const queue = await db.query.beep.findMany({
    where: and(
      inProgressBeep,
      eq(beep.beeper_id, beeperId)
    ),
    orderBy: asc(beep.start),
    with: {
      beeper: {
        columns: {
          id: true,
          first: true,
          last: true,
          photo: true,
          location: true,
          singlesRate: true,
          groupRate: true,
          capacity: true,
          phone: true,
          cashapp: true,
          venmo: true,
        },
        with: {
          cars: {
            where: eq(car.default, true),
            limit: 1,
          },
        }
      },
      rider: {
        columns: {
          id: true,
          first: true,
          last: true,
          venmo: true,
          cashapp: true,
          phone: true,
          photo: true,
          rating: true,
          pushToken: true,
        },
      },
    }
  });

  return queue;
}
