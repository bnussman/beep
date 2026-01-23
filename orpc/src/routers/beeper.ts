import { z } from "zod";
import { authedProcedure } from "../utils/trpc";
import { db } from "../utils/db";
import { eq } from "drizzle-orm";
import { beep, beepStatuses, user } from "../../drizzle/schema";
import { pubSub } from "../utils/pubsub";
import {
  getBeeperQueue,
  getDerivedRiderFields,
  getIsInProgressBeep,
  getQueueSize,
  queueResponseSchema,
  sendBeepUpdateNotificationToRider,
} from "../logic/beep";
import { eventIterator, ORPCError } from "@orpc/server";

export const beeperRouter = {
  queue: authedProcedure
    .output(queueResponseSchema)
    .input(z.string().optional())
    .handler(async ({ input, context }) => {
      if (input && input !== context.user.id && context.user.role !== "admin") {
        throw new ORPCError("UNAUTHORIZED", {
          message: "You must be an admin to view other user's queue.",
        });
      }

      return await getBeeperQueue(input ?? context.user.id);
    }),
  watchQueue: authedProcedure
    .input(z.string().optional())
    .output(eventIterator(queueResponseSchema))
    .handler(async function* ({ context, input, signal }) {
      const id = input ?? context.user.id;

      if (context.user.role === "user" && input && input !== context.user.id) {
        throw new ORPCError("UNAUTHORIZED", {
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

      yield queue;

      const eventSource = pubSub.subscribe("queue", id);

      for await (const { queue } of eventSource) {
        if (signal?.aborted) return;
        yield queue;
      }
    }),
  updateBeep: authedProcedure
    .input(
      z.object({
        beepId: z.string(),
        data: z.object({
          status: z.enum(beepStatuses),
        }),
      }),
    )
    .output(queueResponseSchema)
    .handler(async ({ input, context }) => {
      let queue = await getBeeperQueue(context.user.id);

      const queueEntry = queue.find((entry) => entry.id === input.beepId);

      if (!queueEntry) {
        throw new ORPCError("NOT_FOUND", {
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
        throw new ORPCError("BAD_REQUEST", {
          message: "You must respond to the rider who first joined your queue.",
        });
      }

      const isStartingBeep = input.data.status === "accepted";
      const isEndingBeep =
        input.data.status === "denied" ||
        input.data.status === "complete" ||
        input.data.status === "canceled";

      const values = {
        status: input.data.status,
        ...(isEndingBeep && {
          end: new Date(),
        }),
      };

      await db.update(beep).set(values).where(eq(beep.id, queueEntry.id));

      queueEntry.status = input.data.status;

      if (isStartingBeep || isEndingBeep) {
        await db
          .update(user)
          .set({ queueSize: getQueueSize(queue) })
          .where(eq(user.id, context.user.id));
      }

      if (isEndingBeep) {
        pubSub.publish("ride", queueEntry.rider.id, { ride: null });
      }

      sendBeepUpdateNotificationToRider(
        queueEntry.rider.id,
        queueEntry.status,
        context.user,
      );

      queue = queue.filter(getIsInProgressBeep);

      for (const beep of queue) {
        pubSub.publish("ride", beep.rider_id, {
          ride: { ...beep, ...getDerivedRiderFields(beep, queue) },
        });
      }

      pubSub.publish("queue", context.user.id, { queue });

      return queue;
    }),
};
