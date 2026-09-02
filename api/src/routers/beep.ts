import { z } from "zod";
import { db } from "../utils/db";
import { ORPCError } from "@orpc/server";
import { pubSub } from "../utils/pubsub";
import { count, eq, and } from "drizzle-orm";
import { beep, user } from "../../drizzle/schema";
import { updateLiveActivity } from "../utils/live-activities";
import { clearQueueInputSchema, editBeepInputSchema, getBeepsInputSchema } from "../schemas/beep";
import { condensedUserColumns } from "../logic/user";
import {
  adminProcedure,
  authedProcedure,
} from "../utils/orpc";
import {
  PushNotification,
  sendNotification,
  sendNotifications,
} from "../utils/notifications";
import {
  getBeeperQueue,
  getDerivedRiderFields,
  getIsInProgressBeep,
  inProgressBeep,
  inProgressBeepNew,
} from "../logic/beep";

export const beepRouter = {
  beeps: authedProcedure
    .input(getBeepsInputSchema)
    .handler(async ({ input, context }) => {
      if (context.user.role !== "admin" && input.userId !== context.user.id) {
        throw new ORPCError("UNAUTHORIZED", {
          message: "You cannot view beeps for other users.",
        });
      }

      const where = {
        ...(input.inProgress && inProgressBeepNew),
        ...(input.status && { status: { in: input.status } }),
        ...(input.userId && {
          OR: [{ rider_id: input.userId }, { beeper_id: input.userId }],
        }),
      };

      const page = input.cursor ?? input.page ?? 1;
      const offset = (page - 1) * input.pageSize;

      const [beeps, countData] = await Promise.all([
        db.query.beep.findMany({
          offset,
          limit: input.pageSize,
          where,
          orderBy: { start: "desc" },
          with: {
            beeper: {
              columns: {
                ...condensedUserColumns,
                venmo: true,
                cashapp: true,
                groupRate: true,
                singlesRate: true,
              },
            },
            rider: {
              columns: {
                ...condensedUserColumns,
                venmo: true,
                cashapp: true,
              },
            },
            ratings: true,
          },
        }),
        db.query.beep.findMany({
          columns: {},
          extras: {
            count: count(),
          },
          where,
        }),
      ]);

      const results = countData[0].count;

      return {
        beeps,
        page,
        pages: Math.ceil(results / input.pageSize),
        pageSize: input.pageSize,
        results,
      };
    }),
  beep: authedProcedure
    .input(z.uuid())
    .handler(async ({ input, context }) => {
      const b = await db.query.beep.findFirst({
        where: { id: input },
        with: {
          beeper: {
            columns: condensedUserColumns,
          },
          rider: {
            columns: condensedUserColumns,
          },
        },
      });

      if (!b) {
        throw new ORPCError("NOT_FOUND", {
          message: "Beep not found",
        });
      }

      if (
        context.user.role === "user" &&
        ![b.beeper_id, b.rider_id].includes(context.user.id)
      ) {
        throw new ORPCError("FORBIDDEN", {
          message: "You can't view a beep that you are not involved in.",
        });
      }

      return b;
    }),
  deleteBeep: adminProcedure
    .input(z.uuid())
    .handler(async ({ input }) => {
      await db.delete(beep).where(eq(beep.id, input));
    }),
  editBeep: authedProcedure
    .input(editBeepInputSchema)
    .handler(async ({ context, input }) => {
      const b = await db.query.beep.findFirst({
        where: { id: input.beepId },
      });

      if (!b) {
        throw new ORPCError("NOT_FOUND", { message: "Beep not found" });
      }

      if (b.rider_id !== context.user.id) {
        throw new ORPCError("FORBIDDEN", {
          message: "You can't edit a beep that you are not involved in.",
        });
      }

      if (!getIsInProgressBeep(b)) {
        throw new ORPCError("BAD_REQUEST", {
          message: `You can't edit beep with status ${beep.status}.`,
        });
      }

      await db.update(beep).set(input.data).where(eq(beep.id, input.beepId));

      const beeper = await db.query.user.findFirst({
        where: { id: b.beeper_id },
      });

      const keyToFieldMap = {
        origin: "pick up location",
        destination: "destination location",
        groupSize: "group size",
      };

      const fieldNames = Object.keys(input.data)
        .map((key) => keyToFieldMap[key as keyof typeof keyToFieldMap])
        .join(", ");

      if (beeper?.pushToken) {
        await sendNotification({
          to: beeper.pushToken,
          title: "Rider updated their ride details",
          body: `${context.user.first} updated their ${fieldNames}`,
        });
      }

      // publish updated queue to beeper
      const queue = await getBeeperQueue(b.beeper_id);

      for (const beep of queue) {
        pubSub.publish(`ride-${beep.rider_id}`, {
          ride: { ...beep, ...getDerivedRiderFields(beep, queue) },
        });
      }

      pubSub.publish(`queue-${b.beeper_id}`, { queue });

      return b;
    }),
  clearQueue: adminProcedure
    .input(clearQueueInputSchema)
    .handler(async ({ input }) => {
      const beeper = await db.query.user.findFirst({
        where: { id: input.userId },
        with: {
          beeps: {
            where: inProgressBeepNew,
            with: {
              rider: true,
            },
          },
        },
      });

      if (!beeper) {
        throw new ORPCError("NOT_FOUND", {
          message: "User not found.",
        });
      }

      if (beeper?.beeps.length === 0) {
        throw new ORPCError("BAD_REQUEST", {
          message: "User's queue is already empty.",
        });
      }

      await db
        .update(beep)
        .set({ status: "canceled" })
        .where(and(eq(beep.beeper_id, beeper.id), inProgressBeep));

      const notifications: PushNotification[] = [];

      for (const beep of beeper.beeps) {
        pubSub.publish(`ride-${beep.rider.id}`, { ride: null });

        if (beep.rider_live_activity_token) {
          updateLiveActivity(beep.rider_live_activity_token, {
            action: "end",
            name: "RiderActivity",
          });
        }

        if (beep.rider.pushToken) {
          notifications.push({
            to: beep.rider.pushToken,
            title: "You are no longer getting a ride!",
            body: "An admin cleared your beeper's queue probably because they were inactive.",
          });
        }
      }

      if (beeper.pushToken) {
        notifications.push({
          to: beeper.pushToken,
          title: "Your queue has been cleared",
          body: "An admin has cleared your queue probably because you were inactive!",
        });
      }

      sendNotifications(notifications);

      const u = await db
        .update(user)
        .set({
          ...(input.stopBeeping ? { isBeeping: false } : {}),
          queueSize: 0,
        })
        .where(eq(user.id, beeper.id))
        .returning();

      pubSub.publish(`user-${beeper.id}`, { user: u[0] });
      pubSub.publish(`queue-${beeper.id}`, { queue: [] });
    }),
};
