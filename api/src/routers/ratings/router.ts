import { z } from "zod";
import { adminProcedure, authedProcedure } from "../../utils/orpc";
import { db } from "../../utils/db";
import { count, eq } from "drizzle-orm";
import { ratings, users } from "../../../drizzle/schema";
import { sendNotification } from "../../utils/notifications";
import { pubSub } from "../../utils/pubsub";
import { getUsersAverageRating } from "./logic";
import { ORPCError } from "@orpc/server";
import { condensedUserColumns } from "../users/logic";
import { createRatingInputSchema, deleteRatingInputSchema, listRatingsInputSchema } from "./schemas";

export const ratingRouter = {
  ratings: authedProcedure
    .input(listRatingsInputSchema)
    .handler(async ({ input }) => {
      const where = input.userId
        ? {
          OR: [{ rated_id: input.userId }, { rater_id: input.userId }],
        }
        : {};

      const [ratings, ratingsCount] = await Promise.all([
        db.query.ratings.findMany({
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
              columns: condensedUserColumns,
            },
            rated: {
              columns: condensedUserColumns,
            },
          },
        }),
        db.query.ratings.findMany({
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
  rating: adminProcedure
    .input(z.uuid())
    .handler(async ({ input }) => {
      const rating = await db.query.ratings.findFirst({
        where: { id: input },
        with: {
          rater: {
            columns: condensedUserColumns,
          },
          rated: {
            columns: condensedUserColumns,
          },
        },
      });

      if (!rating) {
        throw new ORPCError("NOT_FOUND");
      }

      return rating;
    }),
  deleteRating: authedProcedure
    .input(deleteRatingInputSchema)
    .handler(async ({ input, context }) => {
      const rating = await db.query.ratings.findFirst({
        where: { id: input.ratingId },
      });

      if (!rating) {
        throw new ORPCError("NOT_FOUND", {
          message: "Rating not found",
        });
      }

      if (context.user.role === "user" && rating.rater_id !== context.user.id) {
        throw new ORPCError("UNAUTHORIZED", {
          message: "You can't delete a rating that you didn't create.",
        });
      }

      await db.delete(ratings).where(eq(ratings.id, rating.id));

      const updatedRating = await getUsersAverageRating(rating.rated_id);

      await db
        .update(users)
        .set({ rating: updatedRating })
        .where(eq(users.id, rating.rated_id));
    }),
  createRating: authedProcedure
    .input(createRatingInputSchema)
    .handler(async ({ context, input }) => {
      const user = await db.query.users.findFirst({
        where: { id: input.userId },
      });

      if (!user) {
        throw new ORPCError("NOT_FOUND", {
          message: "User not found",
        });
      }

      const beep = await db.query.beeps.findFirst({
        where: { id: input.beepId },
      });

      if (!beep) {
        throw new ORPCError("NOT_FOUND", {
          message: "Beep not found",
        });
      }

      if (![beep.rider_id, beep.beeper_id].includes(context.user.id)) {
        throw new ORPCError("BAD_REQUEST", {
          message:
            "You must be the rider or beeper of this beep to leave a rating about it.",
        });
      }

      if (beep.status !== "complete") {
        throw new ORPCError("BAD_REQUEST", {
          message: `You can only leave a rating once the beep is complete. That this beep has a status of ${beep.status}`,
        });
      }

      const r = await db
        .insert(ratings)
        .values({
          id: crypto.randomUUID(),
          timestamp: new Date(),
          stars: input.stars,
          message: input.message,
          beep_id: input.beepId,
          rated_id: user.id,
          rater_id: context.user.id,
        })
        .returning();

      const avgRating = await getUsersAverageRating(user.id);

      await db
        .update(users)
        .set({ rating: avgRating })
        .where(eq(users.id, user.id));

      user.rating = avgRating;

      pubSub.publish(`user-${user.id}`, { user });

      if (user.pushToken) {
        sendNotification({
          to: user.pushToken,
          title: `You got rated ⭐️`,
          body: `${context.user.first} ${context.user.last} rated you ${input.stars} stars.`,
        });
      }

      return r[0];
    }),
};
