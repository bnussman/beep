import { z } from "zod";
import { adminProcedure, router } from "../utils/trpc";
import { db } from "../utils/db";
import { count, eq, or } from "drizzle-orm";
import { rating } from '../../drizzle/schema';

export const ratingRouter = router({
  ratings: adminProcedure
    .input(
      z.object({
        offset: z.number(),
        show: z.number(),
        userId: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const where = input.userId ?
        or(
          eq(rating.rated_id, input.userId),
          eq(rating.rater_id, input.userId)
        )
        : undefined;

      const ratings = await db.query.rating.findMany({
        offset: input.offset,
        limit: input.show,
        where,
        columns: {
          rated_id: false,
          rater_id: false,
        },
        with: {
          rater: {
            columns: {
              id: true,
              first: true,
              last: true,
              photo: true,
            }
          },
          rated: {
            columns: {
              id: true,
              first: true,
              last: true,
              photo: true,
            }
          },
        },
      });

      const ratingsCount = await db
        .select({ count: count() })
        .from(rating)
        .where(where);

      return {
        ratings,
        count: ratingsCount[0].count
      }
    })
});
