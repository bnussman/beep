import { z } from "zod";
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
} from "../utils/trpc";
import {
  getBeeperQueue,
  getDerivedRiderFields,
  getQueueSize,
  getRidersCurrentRide,
  inProgressBeepNew,
  rideResponseSchema,
} from "../logic/beep";
import { eventIterator, ORPCError } from "@orpc/server";

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
        latitude: z.number().optional(),
        longitude: z.number().optional(),
      }),
    )
    .output(rideResponseSchema)
    .handler(async ({ input, context }) => {
      if (input.latitude !== undefined && input.longitude !== undefined) {
        db.update(user)
          .set({
            location: {
              latitude: input.latitude,
              longitude: input.longitude,
            },
          })
          .where(eq(user.id, context.user.id));
      }

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
        throw new ORPCError("NOT_FOUND", { message: "Beeper not found" });
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
      } as const;

      const r = await db.query.beep.findFirst({
        where: { AND: [{ rider_id: context.user.id }, inProgressBeepNew] },
        with: { beeper: { columns: { first: true, last: true } } },
      });

      if (r) {
        throw new ORPCError("BAD_REQUEST", {
          message: `You are already in an active beep with ${r.beeper.first} ${r.beeper.last}. You can't begin another beep until you end that one...`,
        });
      }

      await db.insert(beep).values(newBeep);

      queue.push({
        ...newBeep,
        rider: context.user,
        beeper,
      });

      pubSub.publish("queue", beeper.id, { queue });

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
    .output(rideResponseSchema.nullable())
    .handler(({ context }) => {
      return getRidersCurrentRide(context.user.id);
    }),
  currentRideUpdates: authedProcedure
    .output(
      eventIterator(rideResponseSchema.nullable())
    )
    .handler(async function* ({ context, signal }) {
      console.log("➕ Rider subscribed", context.user.id);

      const eventSource = pubSub.subscribe("ride", context.user.id);

      yield await getRidersCurrentRide(context.user.id);

      if (signal) {
        signal.onabort = () => {
          console.log("➖ Rider unsubscribed", context.user.id);
          eventSource.return();
        };
      }

      for await (const { ride } of eventSource) {
        if (signal?.aborted) return;
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

      const eventSource = pubSub.subscribe("user", input);

      if (signal) {
        signal.onabort = () => {
          eventSource.return();
        };
      }

      for await (const { user } of eventSource) {
        if (signal?.aborted) return;

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
          distance:
            sql<number>`ST_DistanceSphere(location, ST_MakePoint(${input.latitude},${input.longitude}))`.as(
              "distance",
            ),
        })
        .from(user)
        .where(({ distance }) =>
          and(
            eq(user.isBeeping, true),
            lte(distance, DEFAULT_LOCATION_RADIUS * 1609.34),
          ),
        );

      return users.map((user) => {
        const hasher = new Bun.CryptoHasher("sha256");
        hasher.update(user.id);
        const hashedId = hasher.digest("hex");

        return {
          id: hashedId,
          location: user.location,
          distance: user.distance,
        };
      });
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

      const eventSource = pubSub.subscribe("locations");

      if (signal) {
        signal.onabort = () => {
          eventSource.return();
        };
      }

      for await (const data of eventSource) {
        if (signal?.aborted) return;

        if (input.admin) {
          yield data;
        } else if (
          getDistance(
            input.latitude,
            input.longitude,
            data.location.latitude,
            data.location.longitude,
          ) < DEFAULT_LOCATION_RADIUS
        ) {
          const hasher = new Bun.CryptoHasher("sha256");
          hasher.update(data.id);
          yield { id: hasher.digest("hex"), location: data.location };
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

      await db
        .update(beep)
        .set({ status: "canceled", end: new Date() })
        .where(eq(beep.id, entry.id));

      queue = queue.filter((beep) => beep.id !== entry.id);

      pubSub.publish("ride", context.user.id, { ride: null });
      pubSub.publish("queue", beeper.id, { queue });

      for (const beep of queue) {
        pubSub.publish("ride", beep.rider_id, {
          ride: { ...beep, ...getDerivedRiderFields(beep, queue) },
        });
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
};
