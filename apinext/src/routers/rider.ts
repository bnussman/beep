import { z } from "zod";
import { authedProcedure, router } from "../utils/trpc";
import { db } from "../utils/db";
import { payment, user } from "../../drizzle/schema";
import { and, desc, eq, gte, like, lte, sql } from "drizzle-orm";

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
    })
});
