import { z } from "zod";
import { adminProcedure, authedProcedure, router } from "../utils/trpc";
import { db } from "../utils/db";
import { count, desc, eq, or, sql } from "drizzle-orm";
import { rating, user, beep } from "../../drizzle/schema";
import { TRPCError } from "@trpc/server";
import { sendNotification } from "../utils/notifications";
import { pubSub } from "../utils/pubsub";
import { DEFAULT_PAGE_SIZE } from "../utils/constants";

export const ratingRouter = router({
  ratings: authedProcedure
    .input(
      z.object({
        cursor: z.number().optional().default(1),
        pageSize: z.number().default(DEFAULT_PAGE_SIZE),
        userId: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const where = input.userId
        ? or(
            eq(rating.rated_id, input.userId),
            eq(rating.rater_id, input.userId),
          )
        : undefined;

      const ratings = await db.query.rating.findMany({
        offset: (input.cursor - 1) * input.pageSize,
        limit: input.pageSize,
        where,
        columns: {
          rated_id: false,
          rater_id: false,
        },
        orderBy: desc(rating.timestamp),
        with: {
          rater: {
            columns: {
              id: true,
              first: true,
              last: true,
              photo: true,
            },
          },
          rated: {
            columns: {
              id: true,
              first: true,
              last: true,
              photo: true,
            },
          },
        },
      });

      const ratingsCount = await db
        .select({ count: count() })
        .from(rating)
        .where(where);

      const results = ratingsCount[0].count;

      return {
        ratings,
        pageSize: input.pageSize,
        page: input.cursor,
        pages: Math.ceil(results / input.pageSize),
        results,
      };
    }),
  rating: adminProcedure.input(z.string()).query(async ({ input }) => {
    const r = await db.query.rating.findFirst({
      where: eq(rating.id, input),
      with: {
        rater: {
          columns: {
            id: true,
            first: true,
            last: true,
            photo: true,
          },
        },
        rated: {
          columns: {
            id: true,
            first: true,
            last: true,
            photo: true,
          },
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
        ratingId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const r = await db.query.rating.findFirst({
        where: eq(rating.id, input.ratingId),
        with: {
          rated: {
            columns: {
              rating: true,
            },
          },
        },
      });

      if (!r) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Rating not found",
        });
      }

      if (ctx.user.role === "user" && r.rater_id !== ctx.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You can't delete a rating that you didn't create.",
        });
      }

      if (!r.rated.rating) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "You are trying to delete a rating for a user who's rating value is undefined",
        });
      }

      const numberOfRatings = await db
        .select({ count: count() })
        .from(rating)
        .where(eq(rating.rated_id, r.rated_id));

      const numberOfRatingsCount = numberOfRatings[0].count;

      if (numberOfRatingsCount <= 1) {
        await db
          .update(user)
          .set({ rating: null })
          .where(eq(user.id, r.rated_id));
      } else {
        await db
          .update(user)
          .set({
            rating: sql`("rating" * ${numberOfRatingsCount} - ${r.stars}) / (${numberOfRatingsCount} - 1)`,
          })
          .where(eq(user.id, r.rated_id));
      }

      await db.delete(rating).where(eq(rating.id, r.id));
    }),
  createRating: authedProcedure
    .input(
      z.object({
        stars: z.number().min(1).max(5),
        message: z.string().max(255).optional(),
        beepId: z.string().uuid(),
        userId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const u = await db.query.user.findFirst({
        where: eq(user.id, input.userId),
      });

      if (!u) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const b = await db.query.beep.findFirst({
        where: eq(beep.id, input.beepId),
      });

      if (!b) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Beep not found",
        });
      }

      if (![b.rider_id, b.beeper_id].includes(ctx.user.id)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "You must be the rider or beeper of this beep to leave a rating about it.",
        });
      }

      if (b.status !== "complete") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `You can only leave a rating once the beep is complete. That this beep has a status of ${b.status}`,
        });
      }

      const r = await db
        .insert(rating)
        .values({
          id: crypto.randomUUID(),
          timestamp: new Date(),
          stars: input.stars,
          message: input.message,
          beep_id: input.beepId,
          rated_id: input.userId,
          rater_id: ctx.user.id,
        })
        .returning();

      if (!u.rating) {
        const updatedUser = await db
          .update(user)
          .set({ rating: sql`${input.stars}` })
          .where(eq(user.id, u.id))
          .returning();

        pubSub.publish('user', updatedUser[0].id, { user: updatedUser[0] });
      } else {
        const numberOfRatingsForUserCount = await db
          .select({ count: count() })
          .from(rating)
          .where(eq(rating.rated_id, input.userId));

        const numberOfRatingsForUser = numberOfRatingsForUserCount[0].count;

        const updatedUser = await db
          .update(user)
          .set({
            rating: sql`(("rating" * ${numberOfRatingsForUser}) + ${input.stars}) / (${numberOfRatingsForUser + 1})`,
          })
          .where(eq(user.id, u.id))
          .returning();

        pubSub.publish('user', updatedUser[0].id, { user: updatedUser[0] });
      }

      if (u.pushToken) {
        sendNotification({
          to: u.pushToken,
          title: `You got rated ⭐️`,
          body: `${ctx.user.first} ${ctx.user.last} rated you ${input.stars} stars!`,
        });
      }

      return r[0];
    }),
});
