import { z } from "zod";
import { authedProcedure, router, verifiedProcedure } from "../utils/trpc";
import { db } from "../utils/db";
import { beep, car, payment, user } from "../../drizzle/schema";
import { and, asc, count, desc, eq, gte, like, lte, ne, sql, lt, or } from "drizzle-orm";
import { inProgressBeep } from "./beep";
import { TRPCError } from "@trpc/server";
import { observable } from "@trpc/server/observable";
import { redis, redisSubscriber } from "../utils/redis";
import { sendNotification } from "../utils/notifications";
import { pubSub } from "../utils/pubsub";

export const riderRouter = router({
  beepers: verifiedProcedure
    .input(
      z.object({
        longitude: z.number(),
        latitude: z.number(),
      })
    )
    .query(async ({ input }) => {
      const { latitude, longitude } = input;

      const beepers = await db
        .selectDistinct({
          first: user.first,
          last: user.last,
          id: user.id,
          photo: user.photo,
          rating: user.rating,
          singlesRate: user.singlesRate,
          groupRate: user.groupRate,
          queueSize: user.queueSize,
          capacity: user.capacity,
          distance: sql<number>`ST_DistanceSphere(location, ST_MakePoint(${latitude},${longitude}))`.as('distance'),
          isPremium: sql<boolean>`${payment.id} IS NOT NULL`,
        })
        .from(user)
        .where(({ distance }) =>
          and(
            eq(user.isBeeping, true),
            lte(distance, 10 * 1609.34)
          )
        )
        .orderBy(({ distance, isPremium }) => ([
          desc(isPremium),
          desc(distance)
        ]))
        .leftJoin(
          payment,
          and(
            eq(payment.user_id, user.id),
            gte(payment.expires, new Date()),
            or(
              eq(payment.productId, 'top_of_beeper_list_1_hour'),
              eq(payment.productId, 'top_of_beeper_list_2_hours'),
              eq(payment.productId, 'top_of_beeper_list_3_hours'),
            )
          )
        );

      return beepers;
    }),
  startBeep: verifiedProcedure
    .input(
      z.object({
        beeperId: z.string(),
        origin: z.string(),
        destination: z.string(),
        groupSize: z.number()
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.isBeeping) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: "You can't get a beep when you are beeping"
        });
      }

      const beeper = await db.query.user.findFirst({
        columns: {
          password: false,
          passwordType: false,
        },
        where: eq(user.id, input.beeperId),
        with: {
          cars: {
            where: eq(car.default, true),
            limit: 1,
          },
          beeps: {
            where: inProgressBeep,
            orderBy: asc(beep.start),
            with: {
              rider: true,
            },
          }
        },
      });

      if (!beeper) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: "Beeper not found"
        });
      }

      if (!beeper.isBeeping) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: "That user is not beeping. Maybe they stopped beeping."
        });
      }

      const newBeep = {
        beeper_id: beeper.id,
        rider_id: ctx.user.id,
        destination: input.destination,
        origin: input.origin,
        groupSize: input.groupSize,
        id: crypto.randomUUID(),
        start: new Date(),
        status: 'waiting',
        end: null,
      } as const;

      await db.insert(beep).values(newBeep);

      const queue = beeper?.beeps.map((beep) => ({
        ...beep,
        beeper,
      }));

      pubSub.publishBeeperQueue(
        beeper.id,
        [
          ...queue,
          {
            ...newBeep,
            rider: {
              id: ctx.user.id,
              first: ctx.user.first,
              last: ctx.user.last,
              phone: ctx.user.phone,
              venmo: ctx.user.venmo,
              cashapp: ctx.user.cashapp,
              rating: ctx.user.rating,
              photo: ctx.user.photo,
              pushToken: ctx.user.pushToken,
            },
            beeper
          }
        ]
      );

      if (beeper.pushToken) {
        sendNotification({
          to: beeper.pushToken,
          title: `${ctx.user.first} ${ctx.user.last} has entered your queue 🚕`,
          body: "Please accept or deny this rider.",
          categoryId: "newbeep",
          data: { id: newBeep.id }
        });
      }

      return {
        ...newBeep,
        position: queue.length,
        rider: {
          id: ctx.user.id,
          first: ctx.user.first,
          last: ctx.user.last,
        },
        beeper: {
          ...beeper,
          phone: null,
          location: null,
          cars: [],
        },
      };
    }),
  currentRide: authedProcedure
    .query(async ({ ctx }) => {
      return getRidersCurrentRide(ctx.user.id);
    }),
  currentRideUpdates: authedProcedure.subscription(({ ctx }) => {
    // return an `observable` with a callback which is triggered immediately
    return observable<Awaited<ReturnType<typeof getRidersCurrentRide>>>((emit) => {
      const onUserUpdate = (message: string) => {
        // emit data to client
        console.log("Emitting to WS", message);
        emit.next(JSON.parse(message));
      };
      // trigger `onAdd()` when `add` is triggered in our event emitter
      const listener = (message: string) => onUserUpdate(message);
      redisSubscriber.subscribe(`rider-${ctx.user.id}`, listener);
      (async () => {
        const ride = await getRidersCurrentRide(ctx.user.id);
        emit.next(ride);
      })();
      // unsubscribe function when client disconnects or stops subscribing
      return () => {
        redisSubscriber.unsubscribe(`rider-${ctx.user.id}`, listener);
      };
    });
  }),
  beeperLocationUpdates: authedProcedure
    .input(z.string())
    .subscription(({ input }) => {
      // return an `observable` with a callback which is triggered immediately
      return observable<{ id: string; location: { latitude: number; longitude: number } }>((emit) => {
        const onUserUpdate = (message: string) => {
          console.log("Emitting to WS", message);
          emit.next(JSON.parse(message));
        };
        const listener = (message: string) => onUserUpdate(message);
        redisSubscriber.subscribe(`beeper-location-${input}`, listener);
        return () => {
          redisSubscriber.unsubscribe(`beeper-location-${input}`, listener);
        };
      });
  }),
  beepersNearMe: authedProcedure
    .input(
      z.object({
        latitude: z.number(),
        longitude: z.number(),
      })
    )
    .query(async ({ input }) => {
      const users = await db
        .select({
          id: user.id,
          location: user.location,
          distance: sql<number>`ST_DistanceSphere(location, ST_MakePoint(${input.latitude},${input.longitude}))`.as('distance'),
        })
        .from(user)
        .where(({ distance }) =>
          and(
            eq(user.isBeeping, true),
            lte(distance, 10 * 1609.34)
          )
        );

      return users.map((user) => {
        const hasher = new Bun.CryptoHasher("sha256");
        hasher.update(user.id);
        const hashedId = hasher.digest("hex");

        return {
          id: hashedId,
          location: user.location,
          distance: user.distance
        };
      });
    }),
  beepersLocations: authedProcedure
    .input(
      z.object({
        latitude: z.number(),
        longitude: z.number(),
        admin: z.boolean().optional()
      })
    )
    .subscription(({ input, ctx }) => {
      if (input.admin && ctx.user.role !== 'admin') {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      return observable<{ id: string; location: { latitude: number; longitude: number } }>((emit) => {
        const onUserUpdate = (message: string) => {
          console.log("[WS] - All Beepers Location -", message);
          const data = JSON.parse(message) as { id: string; location: { latitude: number; longitude: number } };
          if (input.admin) {
            emit.next(data);
          } else if (getDistance(input.latitude, input.longitude, data.location.latitude, data.location.longitude) < 20) {
            const hasher = new Bun.CryptoHasher("sha256");
            hasher.update(data.id);
            data.id = hasher.digest("hex");
            emit.next(data);
          }
        };
        const listener = (message: string) => onUserUpdate(message);
        redisSubscriber.pSubscribe("beeper-location-*", listener);
        return () => {
          redisSubscriber.pUnsubscribe("beeper-location-*", listener);
        };
      });
    }),
  leaveQueue: authedProcedure
    .input(
      z.object({
        beeperId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const beeper = await db.query.user.findFirst({
        columns: {
          password: false,
          passwordType: false,
        },
        where: eq(user.id, input.beeperId),
        with: {
          cars: {
            where: eq(car.default, true),
            limit: 1,
          },
          beeps: {
            where: inProgressBeep,
            orderBy: asc(beep.start),
            with: {
              rider: {
                columns: {
                  password: false,
                  passwordType: false,
                },
              },
            },
          }
        },
      });

      if (!beeper) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Beeper not found."
        });
      }

      const entry = beeper.beeps.find((beep) => beep.rider.id === ctx.user.id);

      if (!entry) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "You are not in that beepers queue."
        });
      }

      if (beeper.pushToken) {
        sendNotification({
          to: beeper.pushToken,
          title: `${ctx.user.first} ${ctx.user.last} left your queue 🥹`,
          body: "They decided they did not want a beep from you!"
        });
      }

      await db
        .update(beep)
        .set({ status: "canceled", end: new Date() })
        .where(eq(beep.id, entry.id));

      const newQueue = beeper.beeps.filter(beep => beep.id !== entry.id).map((b) => ({ ...b, beeper }));

      pubSub.publishRiderUpdate(ctx.user.id, null);
      pubSub.publishBeeperQueue(beeper.id, newQueue);

      for (const entry of newQueue) {
        pubSub.publishRiderUpdate(
          entry.rider_id,
          { ...entry, position: getPositionInQueue(newQueue, entry), beeper }
        );
      }

      await db.update(user).set({ queueSize: getQueueSize(newQueue) }).where(eq(user.id, beeper.id));

      return true;
    })
});

export async function getRidersCurrentRide(userId: string) {
  const b = await db.query.beep.findFirst({
    where: and(
      eq(beep.rider_id, userId),
      inProgressBeep
    ),
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
            limit: 1
          },
        },
      },
    },
  });

  if (!b) {
    return null;
  }

  const position = await db
    .select({ count: count() })
    .from(beep)
    .where(
      and(
        eq(beep.beeper_id, b.beeper_id),
        lt(beep.start, b.start),
        ne(beep.status, 'waiting'),
        inProgressBeep,
      )
    );

  const isAcceptedBeep =
    b.status === "accepted" ||
    b.status === "in_progress" ||
    b.status === "here" ||
    b.status === "on_the_way";

  return {
    ...b,
    beeper: {
      ...b.beeper,
      location: isAcceptedBeep ? b.beeper.location : null,
      phone: isAcceptedBeep ? b.beeper.phone : null,
    },
    position: position[0].count
  };
};

type Beep = typeof beep.$inferSelect;

export function getPositionInQueue(queue: Beep[], entry: Beep) {
  return queue.filter((q) => q.start < entry.start && q.status !== "waiting").length;
}

export function getQueueSize(queue: Beep[]) {
  return queue.filter(entry => !["waiting", "complete", "canceled", "denied"].includes(entry.status)).length
}


export function getDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c;
  return d * 0.621371;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}