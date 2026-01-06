import { z } from "zod";
import { adminProcedure, authedProcedure, router } from "../utils/trpc";
import { db } from "../utils/db";
import { count, eq } from "drizzle-orm";
import { rating, user } from "../../drizzle/schema";
import { TRPCError } from "@trpc/server";
import { sendNotification } from "../utils/notifications";
import { pubSub } from "../utils/pubsub";
import { DEFAULT_PAGE_SIZE } from "../utils/constants";
import { getUsersAverageRating } from "../logic/rating";

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
        ? {
            OR: [{ rated_id: input.userId }, { rater_id: input.userId }],
          }
        : {};

      const [ratings, ratingsCount] = await Promise.all([
        db.query.rating.findMany({
          offset: (input.cursor - 1) * input.pageSize,
          limit: input.pageSize,
          where,
          columns: {
            rated_id: false,
            rater_id: false,
          },
          orderBy: { timestamp: "desc" },
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
        }),
        db.query.rating.findMany({
          columns: {},
          extras: { count: count() },
          where,
        }),
      ]);

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
      where: { id: input },
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
        where: { id: input.ratingId },
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

      await db.delete(rating).where(eq(rating.id, r.id));

      const updatedRating = await getUsersAverageRating(r.rated_id);

      await db
        .update(user)
        .set({ rating: updatedRating })
        .where(eq(user.id, r.rated_id));
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
        where: { id: input.userId },
      });

      if (!u) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const b = await db.query.beep.findFirst({
        where: { id: input.beepId },
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

      const avgRating = await getUsersAverageRating(u.id);

      await db.update(user).set({ rating: avgRating }).where(eq(user.id, u.id));

      const updatedUser = { ...u, rating: avgRating };

      pubSub.publish("user", u.id, { user: updatedUser });

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
