import { z } from "zod";
import { adminProcedure, authedProcedure, router } from "../utils/trpc";
import { db } from "../utils/db";
import { count, eq, or, sql } from "drizzle-orm";
import { rating, user } from '../../drizzle/schema';
import { TRPCError } from "@trpc/server";

export const ratingRouter = router({
  ratings: adminProcedure
    .input(
      z.object({
        cursor: z.number().optional(),
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
        offset: input.cursor ?? 0,
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
    }),
  rating: adminProcedure
     .input(
       z.string()
     )
     .query(async ({ input }) => {
       const r = await db.query.rating.findFirst({
         where: eq(rating.id, input),
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

       if (!r) {
         throw new TRPCError({ code: "NOT_FOUND" });
       }

       return r;
     }),
  deleteRating: authedProcedure
    .input(
      z.object({
        ratingId: z.string()
      })
    )
    .mutation(async ({ input, ctx }) => {
      const r = await db.query.rating.findFirst({
        where: eq(rating.id, input.ratingId),
        with: {
          rated: true,
        },
      });

      if (!r) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Rating not found"
        });
      }

      if (ctx.user.role === 'user' && r?.rater_id !== ctx.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You can't delete a rating that you didn't create."
        });
      }

      if (!r.rated.rating) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "You are trying to delete a rating for a user who's rating value is undefined"
        });
      }

      const numberOfRatings = await db
        .select({ count: count() })
        .from(rating)
        .where(eq(rating.rated_id, r.rated_id));

      const numberOfRatingsCount = numberOfRatings[0].count;

      if (numberOfRatingsCount <= 1) {
        await db.update(user).set({ rating: null }).where(eq(user.id, r.rated_id));
      } else {
        await db
          .update(user)
          .set({ rating: sql`("rating" * ${numberOfRatingsCount} - ${r.stars}) / (${numberOfRatingsCount} - 1)` })
          .where(eq(user.id, r.rated_id));
      }

      await db.delete(rating).where(eq(rating.id, r.id));
    })
});
