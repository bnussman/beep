import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { authedProcedure, router } from "../utils/trpc";
import { db } from "../utils/db";
import { eq } from "drizzle-orm";
import { beep, beepStatuses, user } from "../../drizzle/schema";
import { pubSub } from "../utils/pubsub";
import { zAsyncIterable } from "../utils/zAsyncIterable";
import {
  getBeeperQueue,
  getDerivedRiderFields,
  getIsInProgressBeep,
  getQueueSize,
  queueResponseSchema,
  sendBeepUpdateNotificationToRider,
} from "../logic/beep";

export const beeperRouter = router({
  queue: authedProcedure
    .output(queueResponseSchema)
    .input(z.string().optional())
    .query(async ({ input, ctx }) => {
      if (input && input !== ctx.user.id && ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be an admin to view other user's queue.",
        });
      }

      return await getBeeperQueue(input ?? ctx.user.id);
    }),
  watchQueue: authedProcedure
    .input(z.string().optional())
    .output(
      zAsyncIterable({
        yield: queueResponseSchema,
        return: queueResponseSchema,
      }),
    )
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
    .mutation(async ({ input, ctx }) => {
      let queue = await getBeeperQueue(ctx.user.id);

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
          .where(eq(user.id, ctx.user.id));
      }

      if (isEndingBeep) {
        pubSub.publish("ride", queueEntry.rider.id, { ride: null });
      }

      sendBeepUpdateNotificationToRider(
        queueEntry.rider.id,
        queueEntry.status,
        ctx.user,
      );

      queue = queue.filter(getIsInProgressBeep);

      for (const beep of queue) {
        pubSub.publish("ride", beep.rider_id, {
          ride: { ...beep, ...getDerivedRiderFields(beep, queue) },
        });
      }

      pubSub.publish("queue", ctx.user.id, { queue });

      return queue;
    }),
});
