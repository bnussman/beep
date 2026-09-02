import { z } from "zod";
import { rideResponseSchema } from "../schemas/beep";
import { updateLiveActivity } from "../utils/live-activities";
import { asyncIteratorObject, ORPCError } from "@orpc/server";
import { sha256 } from "../utils/hash";
import { condensedUserColumns } from "../logic/user";
import { db } from "../utils/db";
import { beep, payment, user } from "../../drizzle/schema";
import { and, asc, desc, eq, gte, lte, sql, or } from "drizzle-orm";
import { sendNotification } from "../utils/notifications";
import { pubSub } from "../utils/pubsub";
import { DEFAULT_LOCATION_RADIUS } from "../utils/constants";
import { getDistance } from "../logic/location";
import {
  authedProcedure,
  mustBeInAcceptedBeep,
  verifiedProcedure,
  withLock,
} from "../utils/orpc";
import {
  getBeeperQueue,
  getDerivedRiderFields,
  getQueueSize,
  getRidersCurrentRide,
  inProgressBeepNew,
} from "../logic/beep";

export const riderRouter = {
  beepers: verifiedProcedure
    .input(
      z
        .object({
          longitude: z.number(),
          latitude: z.number(),
        })
        .optional(),
    )
    .handler(async ({ input, context }) => {
      if (context.user.role === "user" && input === undefined) {
        throw new ORPCError("BAD_REQUEST", {
          message:
            "You must pass location infromation to get beepers. Only admins can pass no location.",
        });
      }

      const beepers = await db
        .selectDistinct({
          first: user.first,
          last: user.last,
          username: user.username,
          id: user.id,
          photo: user.photo,
          rating: user.rating,
          singlesRate: user.singlesRate,
          groupRate: user.groupRate,
          queueSize: user.queueSize,
          capacity: user.capacity,
          ...(context.user.role === "admin" && { location: user.location }),
          distance:
            sql<number>`ST_DistanceSphere(location, ST_MakePoint(${input?.latitude ?? 0},${input?.longitude ?? 0}))`.as(
              "distance",
            ),
          isPremium: sql<boolean>`${payment.id} IS NOT NULL`,
        })
        .from(user)
        .where(({ distance }) =>
          and(
            eq(user.isBeeping, true),
            input
              ? lte(distance, DEFAULT_LOCATION_RADIUS * 1609.34)
              : undefined,
          ),
        )
        .orderBy(({ distance, isPremium }) => [desc(isPremium), asc(distance)])
        .leftJoin(
          payment,
          and(
            eq(payment.user_id, user.id),
            gte(payment.expires, new Date()),
            or(
              eq(payment.productId, "top_of_beeper_list_1_hour"),
              eq(payment.productId, "top_of_beeper_list_2_hours"),
              eq(payment.productId, "top_of_beeper_list_3_hours"),
            ),
          ),
        );

      return beepers;
    }),
  startBeep: verifiedProcedure
    .use(withLock)
    .input(
      z.object({
        beeperId: z.string(),
        origin: z.string(),
        destination: z.string(),
        groupSize: z.number().min(1).max(25),
        latitude: z.number(),
        longitude: z.number(),
      }),
    )
    .output(rideResponseSchema)
    .handler(async ({ input, context }) => {
      const location = {
        latitude: input.latitude,
        longitude: input.longitude,
      };

      await db.update(user).set({ location }).where(eq(user.id, context.user.id));

      pubSub.publish(`user-${context.user.id}`, { user: { ...context.user, location } });

      if (context.user.isBeeping) {
        throw new ORPCError("BAD_REQUEST", {
          message: "You can't get a beep when you are beeping",
        });
      }

      const beeper = await db.query.user.findFirst({
        where: { id: input.beeperId },
      });

      const queue = await getBeeperQueue(input.beeperId);

      if (!beeper) {
        throw new ORPCError("NOT_FOUND", {
          message: "Beeper not found",
        });
      }

      if (!beeper.isBeeping) {
        throw new ORPCError("BAD_REQUEST", {
          message: "That user is not beeping. Maybe they stopped beeping.",
        });
      }

      if (queue.some((beep) => beep.rider_id === context.user.id)) {
        throw new ORPCError("BAD_REQUEST", {
          message: "You are already in that beeper's queue.",
        });
      }

      const newBeep = {
        beeper_id: beeper.id,
        rider_id: context.user.id,
        destination: input.destination,
        origin: input.origin,
        groupSize: input.groupSize,
        id: crypto.randomUUID(),
        start: new Date(),
        status: "waiting",
        end: null,
        rider_live_activity_token: null,
        rider_live_activity_id: null,
        pick_up_eta: null,
        pick_up_eta_updated_at: null
      } as const;

      const currentRide = await db.query.beep.findFirst({
        where: { AND: [{ rider_id: context.user.id }, inProgressBeepNew] },
      });

      if (currentRide) {
        throw new ORPCError("BAD_REQUEST", {
          message:
            "You are already in an active beep. You can't start another beep until your current one is done.",
        });
      }

      await db.insert(beep).values(newBeep);

      queue.push({
        ...newBeep,
        rider: context.user,
        beeper,
      });

      pubSub.publish(`queue-${beeper.id}`, { queue });

      for (const beep of queue) {
        pubSub.publish(`ride-${beep.rider_id}`, {
          ride: { ...beep, ...getDerivedRiderFields(beep, queue) },
        });
      }

      if (beeper.pushToken) {
        sendNotification({
          to: beeper.pushToken,
          title: `${context.user.first} ${context.user.last} has entered your queue 🚕`,
          body: "Please accept or deny this rider.",
          categoryId: "newbeep",
          data: { id: newBeep.id },
        });
      }

      return {
        ...newBeep,
        ...getDerivedRiderFields(newBeep, queue),
        beeper,
      };
    }),
  currentRide: authedProcedure
    .input(z.string().optional())
    .output(rideResponseSchema.nullable())
    .handler(({ input, context }) => {
      const userId = input ?? context.user.id;

      if (context.user.role === "user" && userId !== context.user.id) {
        throw new ORPCError("FORBIDDEN", {
          message:
            "You must be an admin to view the current ride of another user",
        });
      }

      return getRidersCurrentRide(userId);
    }),
  currentRideUpdates: authedProcedure
    .input(z.string().optional())
    .output(
      asyncIteratorObject(rideResponseSchema.partial().nullable())
    )
    .handler(async function* ({ context, signal, input }) {
      const userId = input ?? context.user.id;

      if (context.user.role === "user" && userId !== context.user.id) {
        throw new ORPCError("FORBIDDEN", {
          message:
            "You must be an admin to view the current ride of another user",
        });
      }

      console.log("➕ Rider subscribed", userId);

      const eventSource = pubSub.subscribe(`ride-${userId}`, { signal });

      yield await getRidersCurrentRide(userId);

      if (signal) {
        signal.onabort = () => {
          console.log("➖ Rider unsubscribed", userId);
        };
      }

      for await (const { ride } of eventSource) {
        yield ride;
      }
    }),
  currentRideUpdatesAllowPartial: authedProcedure
    .input(z.string().optional())
    .output(
      asyncIteratorObject(rideResponseSchema.partial().nullable())
    )
    .handler(async function* ({ context, signal, input }) {
      const userId = input ?? context.user.id;

      if (context.user.role === "user" && userId !== context.user.id) {
        throw new ORPCError("FORBIDDEN", {
          message:
            "You must be an admin to view the current ride of another user",
        });
      }

      console.log("➕ Rider subscribed", userId);

      const iterator = pubSub.subscribe(`ride-${userId}`);

      yield await getRidersCurrentRide(userId);

      if (signal) {
        signal.onabort = () => {
          console.log("➖ Rider unsubscribed", userId);
        };
      }

      for await (const { ride } of iterator) {
        yield ride;
      }
    }),
  beeperLocationUpdates: authedProcedure
    .input(z.string())
    .use(mustBeInAcceptedBeep)
    .handler(async function* ({ input, signal }) {
      const beeper = await db.query.user.findFirst({
        where: { id: input },
        columns: { location: true },
      });

      if (!beeper) {
        throw new ORPCError("NOT_FOUND");
      }

      if (beeper.location) {
        yield beeper.location;
      }

      const iterator = pubSub.subscribe(`user-${input}`, { signal });

      for await (const { user } of iterator) {
        if (user.location) {
          yield user.location;
        }
      }
    }),
  beepersNearMe: authedProcedure
    .input(
      z.object({
        latitude: z.number(),
        longitude: z.number(),
      }),
    )
    .handler(async ({ input }) => {
      const users = await db
        .select({
          id: user.id,
          location: user.location,
        })
        .from(user)
        .where(
          and(
            eq(user.isBeeping, true),
            sql`ST_DWithin(location::geography, ST_MakePoint(${input.latitude},${input.longitude})::geography, ${DEFAULT_LOCATION_RADIUS * 1609.34})`,
          ),
        );

      return users.map((user) => ({
        id: sha256(user.id),
        location: user.location,
      }));
    }),
  beepersLocations: authedProcedure
    .input(
      z.object({
        latitude: z.number(),
        longitude: z.number(),
        admin: z.boolean().optional(),
      }),
    )
    .handler(async function* ({ input, context, signal }) {
      if (input.admin && context.user.role !== "admin") {
        throw new ORPCError("UNAUTHORIZED");
      }

      const iterator = pubSub.subscribe("locations", { signal });

      for await (const data of iterator) {
        if (input.admin) {
          yield data;
        } else if (
          getDistance(input, data.location) < DEFAULT_LOCATION_RADIUS
        ) {
          yield { id: sha256(data.id), location: data.location };
        }
      }
    }),
  leaveQueue: authedProcedure
    .input(
      z.object({
        beeperId: z.string(),
      }),
    )
    .handler(async ({ context, input }) => {
      const beeper = await db.query.user.findFirst({
        where: { id: input.beeperId },
      });

      if (!beeper) {
        throw new ORPCError("NOT_FOUND", {
          message: "Beeper not found.",
        });
      }

      let queue = await getBeeperQueue(input.beeperId);

      if (!beeper) {
        throw new ORPCError("NOT_FOUND", {
          message: "Beeper not found.",
        });
      }

      const entry = queue.find((beep) => beep.rider.id === context.user.id);

      if (!entry) {
        throw new ORPCError("NOT_FOUND", {
          message: "You are not in that beepers queue.",
        });
      }

      if (beeper.pushToken) {
        sendNotification({
          to: beeper.pushToken,
          title: `${context.user.first} ${context.user.last} left your queue 🥹`,
          body: "They decided they did not want a beep from you!",
        });
      }

      if (entry.rider_live_activity_token) {
        updateLiveActivity(entry.rider_live_activity_token, {
          action: "end",
          name: "RiderActivity",
        });
      }

      await db
        .update(beep)
        .set({ status: "canceled", end: new Date() })
        .where(eq(beep.id, entry.id));

      queue = queue.filter((beep) => beep.id !== entry.id);

      pubSub.publish(`ride-${context.user.id}`, { ride: null });
      pubSub.publish(`queue-${beeper.id}`, { queue });

      for (const beep of queue) {
        const ride = { ...beep, ...getDerivedRiderFields(beep, queue) }
        pubSub.publish(`ride-${beep.rider_id}`, {
          ride,
        });
        if (ride.rider_live_activity_token) {
          updateLiveActivity(ride.rider_live_activity_token, {
            action: "update",
            name: "RiderActivity",
            props: {
              name: beep.beeper.first,
              positionInQueue: ride.position,
              status: ride.status
            },
          });
        }
      }

      await db
        .update(user)
        .set({ queueSize: getQueueSize(queue) })
        .where(eq(user.id, beeper.id));

      return true;
    }),
  getLastBeepToRate: authedProcedure.handler(async ({ context }) => {
    const mostRecentCompletedBeep = await db.query.beep.findFirst({
      orderBy: { start: "desc" },
      where: {
        OR: [{ rider_id: context.user.id }, { beeper_id: context.user.id }],
        status: "complete",
      },
      with: {
        ratings: true,
        beeper: {
          columns: condensedUserColumns,
        },
        rider: {
          columns: condensedUserColumns,
        },
      },
    });

    if (!mostRecentCompletedBeep) {
      return null;
    }

    if (
      mostRecentCompletedBeep.ratings.some(
        (rating) => rating.rater_id === context.user.id,
      )
    ) {
      return null;
    }

    return mostRecentCompletedBeep;
  }),
  setBeepLiveActivityToken: authedProcedure
    .input(
      z.object({
        beepId: z.string(),
        token: z.string(),
        activityId: z.string(),
      }),
    )
    .handler(async ({ context, input }) => {
      const b = await db.query.beep.findFirst({
        where: { id: input.beepId },
      });

      if (!b) {
        throw new ORPCError("NOT_FOUND", { message: "Beep not found." });
      }

      if (context.user.id !== b.rider_id) {
        throw new ORPCError("FORBIDDEN", {
          message:
            "You must be the rider of the beep to set the rider live activity token",
        });
      }

      console.log("Got new push token for activity", input.activityId);

      await db
        .update(beep)
        .set({
          rider_live_activity_token: input.token,
          rider_live_activity_id: input.activityId,
        })
        .where(eq(beep.id, b.id));

      return {};
    }),
  updateLiveActivityToken: authedProcedure
    .input(z.object({ activityId: z.string(), token: z.string() }))
    .handler(async ({ input, context }) => {
      const b = await db.query.beep.findFirst({
        where: { rider_live_activity_id: input.activityId },
      });

      if (!b) {
        throw new ORPCError("NOT_FOUND", { message: "Beep not found." });
      }

      if (b.rider_id !== context.user.id) {
        throw new ORPCError("FORBIDDEN", {
          message:
            "You must be the rider of the beep to set the rider live activity token",
        });
      }

      console.log("Got updated push token for activity", input.activityId);

      await db
        .update(beep)
        .set({ rider_live_activity_token: input.token })
        .where(eq(beep.id, b.id));

      return {};
    }),
};
