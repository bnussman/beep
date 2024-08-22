import { z } from "zod";
import { authedProcedure, router } from "../utils/trpc";
import { db } from "../utils/db";
import { beep, payment, user } from "../../drizzle/schema";
import { and, asc, desc, eq, gte, like, lte, sql } from "drizzle-orm";
import { inProgressBeep } from "./beep";
import { TRPCError } from "@trpc/server";

export const riderRouter = router({
  beepers: authedProcedure
    .input(
      z.object({
        longitude: z.number(),
        latitude: z.number(),
      })
    )
    .query(async ({ input }) => {
      const { latitude, longitude } = input;

      const beepers = await db
        .select({
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
            like(payment.productId, 'top_of_beeper_list_%')
          )
        );

      return beepers;
    }),
  startBeep: authedProcedure
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
          id: true,
          first: true,
          last: true,
          isBeeping: true,
        },
        where: eq(user.id, input.beeperId),
        with: {
          beeps: {
            where: inProgressBeep,
            orderBy: asc(beep.start),
            with: {
              rider: {
                columns: {
                  id: true,
                  first: true,
                  last: true,
                },
              },
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
        status: 'waiting'
      } as const;

      await db.insert(beep).values(newBeep);

      const queue = beeper?.beeps.map((beep) => ({
        ...beep,
        beeper: {
          id: beeper.id,
          first: beeper.first,
          last: beeper.first,
        },
      }));

      // @todo emit queue update to beeper

      // @todo send notification

      return {
        ...newBeep,
        rider: {
          id: ctx.user.id,
          first: ctx.user.first,
          last: ctx.user.last,
        },
        beeper: {
          id: beeper.id,
          first: beeper.first,
          last: beeper.first,
        }
      };
    })
});
