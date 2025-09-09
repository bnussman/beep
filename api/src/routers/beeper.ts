import * as Sentry from "@sentry/bun";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { authedProcedure, router } from "../utils/trpc";
import { db } from "../utils/db";
import { eq } from "drizzle-orm";
import { beep, user } from "../../drizzle/schema";
import { sendNotification } from "../utils/notifications";
import { pubSub } from "../utils/pubsub";
import {
  getBeeperQueue,
  getProtectedBeeperQueue,
  getQueueSize,
  getRiderBeepFromBeeperQueue,
} from "../logic/beep";

export const beeperRouter = router({
  queue: authedProcedure
    .input(z.string().optional())
    .query(async ({ input, ctx }) => {
      if (input && input !== ctx.user.id && ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be an admin to view other user's queue.",
        });
      }

      const queue = await getBeeperQueue(input ?? ctx.user.id);

      return getProtectedBeeperQueue(queue);
    }),
  watchQueue: authedProcedure
    .input(z.string().optional())
    .subscription(async function* ({ ctx, input, signal }) {
      const id = input ?? ctx.user.id;

      if (ctx.user.role === "user" && input && input !== ctx.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message:
            "You do not have permission to subscribe to another user's queue",
        });
      }

      console.log("➕ Beeper subscribed", id);

      if (signal) {
        signal.onabort = () => {
          console.log("➖ Beeper unsubscribed", id);
          eventSource.return();
        };
      }

      const queue = await getBeeperQueue(id);

      yield getProtectedBeeperQueue(queue);

      const eventSource = pubSub.subscribe("queue", id);

      for await (const { queue } of eventSource) {
        if (signal?.aborted) return;
        yield getProtectedBeeperQueue(queue);
      }
    }),
  updateBeep: authedProcedure
    .input(
      z.object({
        beepId: z.string(),
        data: z.object({
          status: z.enum([
            "canceled",
            "denied",
            "waiting",
            "accepted",
            "on_the_way",
            "here",
            "in_progress",
            "complete",
          ]),
        }),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const queue = await getBeeperQueue(ctx.user.id);

      const queueEntry = queue.find((entry) => entry.id === input.beepId);

      if (!queueEntry) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Can't find that beep.",
        });
      }

      const isAcceptingOrDenying =
        input.data.status === "accepted" || input.data.status === "denied";

      if (
        isAcceptingOrDenying &&
        queue.filter(
          (entry) =>
            entry.start < queueEntry.start && entry.status === "waiting",
        ).length !== 0
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You must respond to the rider who first joined your queue.",
        });
      }

      await db
        .update(beep)
        .set({ status: input.data.status })
        .where(eq(beep.id, queueEntry.id));

      queueEntry.status = input.data.status;

      if (input.data.status === "accepted") {
        await db
          .update(user)
          .set({ queueSize: getQueueSize(queue) })
          .where(eq(user.id, ctx.user.id));
      }

      if (
        input.data.status === "denied" ||
        input.data.status === "complete" ||
        input.data.status === "canceled"
      ) {
        pubSub.publish("ride", queueEntry.rider_id, { ride: null });

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
          case "canceled":
            sendNotification({
              to: queueEntry.rider.pushToken,
              title: `${ctx.user.first} ${ctx.user.last} has canceled your beep 🚫`,
              body: "Open your app to find a new beep",
            });
            break;
          case "denied":
            sendNotification({
              to: queueEntry.rider.pushToken,
              title: `${ctx.user.first} ${ctx.user.last} has denied your beep request 🚫`,
              body: "Open your app to find a different beeper",
            });
            break;
          case "accepted":
            sendNotification({
              to: queueEntry.rider.pushToken,
              title: `${ctx.user.first} ${ctx.user.last} has accepted your beep request ✅`,
              body: "You will receive another notification when they are on their way to pick you up",
            });
            break;
          case "on_the_way":
            sendNotification({
              to: queueEntry.rider.pushToken,
              title: `${ctx.user.first} ${ctx.user.last} is on their way 🚕`,
              body: `Your beeper is on their way in a ${queueEntry.beeper.cars[0]?.color} ${queueEntry.beeper.cars[0]?.make} ${queueEntry.beeper.cars[0]?.model}`,
            });
            break;
          case "here":
            sendNotification({
              to: queueEntry.rider.pushToken,
              title: `${ctx.user.first} ${ctx.user.last} is here 📍`,
              body: `Look for a ${queueEntry.beeper.cars[0]?.color} ${queueEntry.beeper.cars[0]?.make} ${queueEntry.beeper.cars[0]?.model}`,
            });
            break;
          case "in_progress":
            // Beep is in progress - no notification needed at this stage.
            break;
          case "complete":
            // Beep is complete.
            break;
          default:
            Sentry.captureException(
              "Our beeper's state notification switch statement reached a point that is should not have",
            );
        }
      }

      const newQueue = queue.filter(
        (beep) =>
          beep.status !== "complete" &&
          beep.status !== "denied" &&
          beep.status !== "canceled",
      );

      pubSub.publish("queue", ctx.user.id, { queue: newQueue });

      for (const beep of newQueue) {
        pubSub.publish("ride", beep.rider_id, {
          ride: getRiderBeepFromBeeperQueue(beep, newQueue),
        });
      }

      return getProtectedBeeperQueue(newQueue);
    }),
});
