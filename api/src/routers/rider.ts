import { z } from "zod";
import { authedProcedure, router, verifiedProcedure } from "../utils/trpc";
import { db } from "../utils/db";
import { beep, car, payment, user } from "../../drizzle/schema";
import { and, asc, count, desc, eq, gte, lte, ne, sql, lt, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { sendNotification } from "../utils/notifications";
import { pubSub } from "../utils/pubsub";
import { getIsAcceptedBeep, getQueueSize, getRiderBeepFromBeeperQueue, inProgressBeep } from "../utils/beep";

export const riderRouter = router({
  beepers: verifiedProcedure
    .input(
      z.object({
        longitude: z.number(),
        latitude: z.number(),
      }).optional()
    )
    .query(async ({ input, ctx }) => {
      if (ctx.user.role === "user" && input === undefined) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: "You must pass location infromation to get beepers. Only admins can pass no location."
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
          ...(ctx.user.role === "admin" && { location: user.location }),
          distance: sql<number>`ST_DistanceSphere(location, ST_MakePoint(${input?.latitude ?? 0},${input?.longitude ?? 0}))`.as('distance'),
          isPremium: sql<boolean>`${payment.id} IS NOT NULL`,
        })
        .from(user)
        .where(({ distance }) =>
          and(
            eq(user.isBeeping, true),
            input ? lte(distance, 10 * 1609.34) : undefined
          )
        )
        .orderBy(({ distance, isPremium }) => ([
          desc(isPremium),
          asc(distance)
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
        groupSize: z.number().min(1).max(25)
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

      if (beeper.beeps.some((beep) => beep.rider_id === ctx.user.id)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: "You are already in that beeper's queue."
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

      const newQueue = [
        ...queue,
        {
          ...newBeep,
          rider: ctx.user,
          beeper
        }
      ];

      pubSub.publish('queue', beeper.id, { queue: newQueue });

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
        rider: ctx.user,
        beeper
      };
    }),
  currentRide: authedProcedure
    .query(async ({ ctx }) => {
      return getRidersCurrentRide(ctx.user.id);
    }),
  currentRideUpdates: authedProcedure.subscription(async function*({ ctx, signal }) {
    console.log("➕ Rider subscribed", ctx.user.id);

    const eventSource = pubSub.subscribe("ride", ctx.user.id);

    yield await getRidersCurrentRide(ctx.user.id);

    if (signal) {
      signal.onabort = () => {
        console.log("➖ Rider unsubscribed", ctx.user.id);
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
    .subscription(async function*({ input, signal }) {
      const eventSource = pubSub.subscribe("user", input);

      if (signal) {
        signal.onabort = () => {
          eventSource.return();
        };
      }

      for await (const { user } of eventSource) {
        if (signal?.aborted) return;

       if (user.location) {
         yield { id: user.id, location: user.location };
       }
      }
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
    .subscription(async function*({ input, ctx, signal }) {
      if (input.admin && ctx.user.role !== 'admin') {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const eventSource = pubSub.subscribe('locations');

      if (signal) {
        signal.onabort = () => {
          eventSource.return();
        };
      }

      for await (const data of eventSource) {
        if (signal?.aborted) return;

        if (input.admin) {
          yield data;
        } else if (getDistance(input.latitude, input.longitude, data.location.latitude, data.location.longitude) < 20) {
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

      pubSub.publish('ride', ctx.user.id, { ride: null });
      pubSub.publish('queue', beeper.id, { queue: newQueue });

      for (const beep of newQueue) {
        pubSub.publish('ride', entry.rider_id, { ride: getRiderBeepFromBeeperQueue(beep.rider_id, newQueue) });
      }

      await db.update(user).set({ queueSize: getQueueSize(newQueue) }).where(eq(user.id, beeper.id));

      return true;
    }),
    getLastBeepToRate: authedProcedure.query(async ({ ctx }) => {
      const mostRecentCompletedBeep = await db.query.beep.findFirst({
        orderBy: desc(beep.start),
        where: and(
          or(
             eq(beep.rider_id, ctx.user.id),
             eq(beep.beeper_id, ctx.user.id)
          ),
          eq(beep.status, 'complete')
        ),
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
        }
      });

      if (!mostRecentCompletedBeep) {
        return null;
      }

      if (mostRecentCompletedBeep.ratings.some((rating) => rating.rater_id === ctx.user.id)) {
        return null;
      }

      return mostRecentCompletedBeep;
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

  return {
    ...b,
    position: position[0].count
  };
};

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
