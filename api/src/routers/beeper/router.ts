import { z } from "zod";
import { db } from "../../utils/db";
import { eq } from "drizzle-orm";
import { authedProcedure } from "../../utils/orpc";
import { pubSub } from "../../utils/pubsub";
import { beeps, users } from "../../../drizzle/schema";
import { queueResponseSchema } from "./schemas";
import { updateBeepAsBeeperInputSchema } from "../beeps/schemas";
import { updateLiveActivity } from "../../utils/live-activities";
import { asyncIteratorObject, ORPCError } from "@orpc/server";
import {
  getBeeperQueue,
  getDerivedRiderFields,
  getETA,
  getIsInProgressBeep,
  getQueueSize,
  sendBeepUpdateNotificationToRider,
} from "../beeps/logic";

export const beeperRouter = {
  queue: authedProcedure
    .output(queueResponseSchema)
    .input(z.uuid().optional())
    .handler(async ({ input, context }) => {
      if (input && input !== context.user.id && context.user.role !== "admin") {
        throw new ORPCError("UNAUTHORIZED", {
          message: "You must be an admin to view other user's queue.",
        });
      }

      return await getBeeperQueue(input ?? context.user.id);
    }),
  watchQueue: authedProcedure
    .input(z.uuid().optional())
    .output(asyncIteratorObject(queueResponseSchema))
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
        };
      }

      yield await getBeeperQueue(id);

      const iterator = pubSub.subscribe(`queue-${id}`, { signal });

      for await (const { queue } of iterator) {
        yield queue;
      }
    }),
  updateBeep: authedProcedure
    .input(updateBeepAsBeeperInputSchema)
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
      const isQueueSizeChanging = isStartingBeep || isEndingBeep;

      const values: Partial<typeof beeps.$inferInsert> = {
        status: input.data.status,
        ...(isEndingBeep && {
          end: new Date(),
        }),
      };

      if (input.data.status === 'on_the_way' && context.user.location && queueEntry.rider.location) {
        const eta = await getETA([context.user.location, queueEntry.rider.location]);

        if (eta) {
          values.pick_up_eta = eta;
          values.pick_up_eta_updated_at = new Date();
        }
      }

      await db.update(beeps).set(values).where(eq(beeps.id, queueEntry.id));

      Object.assign(queueEntry, values);

      if (isQueueSizeChanging) {
        await db
          .update(users)
          .set({ queueSize: getQueueSize(queue) })
          .where(eq(users.id, context.user.id));
      }

      for (const beep of queue) {
        const ride = { ...beep, ...getDerivedRiderFields(beep, queue) };

        if (beep.id === input.beepId && isEndingBeep) {
          pubSub.publish(`ride-${beep.rider_id}`, { ride: null });
        } else {
          pubSub.publish(`ride-${beep.rider_id}`, { ride });
        }

        if (beep.id === input.beepId) {
          sendBeepUpdateNotificationToRider(ride, context.user);
        } else if (ride.rider_live_activity_token && isQueueSizeChanging) {
          updateLiveActivity(ride.rider_live_activity_token, {
            action: "update",
            name: "RiderActivity",
            props: {
              name: `${beep.beeper.first} ${beep.beeper.last}`,
              positionInQueue: ride.position,
              status: ride.status,
            },
          });
        }
      }

      queue = queue.filter(getIsInProgressBeep);

      pubSub.publish(`queue-${context.user.id}`, { queue });

      return queue;
    }),
};
