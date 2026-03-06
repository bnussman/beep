import { z } from "zod";
import { adminProcedure, authedProcedure, router } from "../utils/trpc";
import { db } from "../utils/db";
import { count, eq, and } from "drizzle-orm";
import { beep, user } from "../../drizzle/schema";
import { TRPCError } from "@trpc/server";
import { PushNotification, sendNotification, sendNotifications } from "../utils/notifications";
import { pubSub } from "../utils/pubsub";
import { getBeeperQueue, getDerivedRiderFields, getIsInProgressBeep, inProgressBeep, inProgressBeepNew } from "../logic/beep";
import { DEFAULT_PAGE_SIZE } from "../utils/constants";

export const beepRouter = router({
  beeps: authedProcedure
    .input(
      z.object({
        cursor: z.number().min(1).optional(),
        page: z.number().min(1).optional(),
        pageSize: z.number().default(DEFAULT_PAGE_SIZE),
        inProgress: z.boolean().optional(),
        userId: z.string().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin" && input.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You cannot view beeps for other users.",
        });
      }

      const where = {
        ...(input.inProgress && inProgressBeepNew),
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
  beep: authedProcedure.input(z.string()).query(async ({ input, ctx }) => {
    const b = await db.query.beep.findFirst({
      where: { id: input },
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
        message: "Beep not found",
      });
    }

    if (
      ctx.user.role === "user" &&
      ![b.beeper_id, b.rider_id].includes(ctx.user.id)
    ) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You can't view a beep that you are not involved in.",
      });
    }

    return b;
  }),
  deleteBeep: adminProcedure.input(z.string()).mutation(async ({ input }) => {
    await db.delete(beep).where(eq(beep.id, input));
  }),
  editBeep: authedProcedure
    .input(
      z.object({
        beepId: z.string(),
        data: z.object({
          origin: z.string(),
          destination: z.string(),
          groupSize: z.number().min(1).max(25),
        }).partial(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const b = await db.query.beep.findFirst({
        where: { id: input.beepId },
      });

      if (!b) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Beep not found" });
      }

      if (b.rider_id !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can't edit a beep that you are not involved in.",
        });
      }

      if (!getIsInProgressBeep(b)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
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
        groupSize: "group size"
      }

      const fieldNames = Object.keys(input.data).map((key) => keyToFieldMap[key as keyof typeof keyToFieldMap]).join(", ");

      if (beeper?.pushToken) {
        await sendNotification({
          to: beeper.pushToken,
          title: "Rider updated their ride details",
          body: `${ctx.user.first} updated their ${fieldNames}`,
        });
      }

      // publish updated queue to beeper
      const queue = await getBeeperQueue(b.beeper_id);

      for (const beep of queue) {
        pubSub.publish("ride", beep.rider_id, {
          ride: { ...beep, ...getDerivedRiderFields(beep, queue) },
        });
      }

      pubSub.publish("queue", b.beeper_id, { queue });

      return b;
    }),
  clearQueue: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        stopBeeping: z.boolean(),
      }),
    )
    .mutation(async ({ input }) => {
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
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found.",
        });
      }

      if (beeper?.beeps.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User's queue is already empty.",
        });
      }

      await db
        .update(beep)
        .set({ status: "canceled" })
        .where(and(eq(beep.beeper_id, beeper.id), inProgressBeep));

      const notifications: PushNotification[] = [];

      for (const beep of beeper.beeps) {
        pubSub.publish("ride", beep.rider.id, { ride: null });

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

      pubSub.publish("user", beeper.id, { user: u[0] });
      pubSub.publish("queue", beeper.id, { queue: [] });
    }),
});
