import { z } from "zod";
import { adminProcedure, router } from "../utils/trpc";
import { db } from "../utils/db";
import { count } from "drizzle-orm";
import { rating } from '../../drizzle/schema';

export const ratingRouter = router({
  ratings: adminProcedure
    .input(
      z.object({
        offset: z.number(),
        show: z.number(),
      })
    )
    .query(async ({ input }) => {
      const ratings = await db.query.rating.findMany({
        offset: input.offset,
        limit: input.show,
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
        .from(rating);

      return {
        ratings,
        count: ratingsCount[0].count
      }
    })
});
