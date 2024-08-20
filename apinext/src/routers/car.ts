import { z } from "zod";
import { adminProcedure, authedProcedure, router } from "../utils/trpc";
import { db } from "../utils/db";
import { car } from "../../drizzle/schema";
import { count, desc, eq } from 'drizzle-orm';
import { TRPCError } from "@trpc/server";
import { sendNotification } from "../utils/notifications";

export const carRouter = router({
  cars: adminProcedure
    .input(
      z.object({
        show: z.number(),
        offset: z.number(),
        userId: z.string().optional()
      })
    )
    .query(async ({ input }) => {
      const where = input.userId ? eq(car.user_id, input.userId) : undefined;

      const cars = await db.query.car.findMany({
        limit: input.show,
        offset: input.offset,
        orderBy: desc(car.created),
        where,
        with: {
          user: {
            columns: {
              id: true,
              first: true,
              last: true,
              photo: true,
            },
          }
        }
      });

      const carsCount = await db
        .select({ count: count() })
        .from(car)
        .where(where);

      return {
        cars,
        count: carsCount[0].count
      }
    }),
  deleteCar: authedProcedure
    .input(
      z.object({
        carId: z.string(),
        reason: z.string().optional()
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin' && input.reason) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Only admins can specify a reason."
        });
      }

      const c = await db.query.car.findFirst({
        where: eq(car.id, input.carId),
        with: {
          user: true,
        },
      });

      if (!c) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Car not found"
        });
      }

      if (c.default && c.user.isBeeping) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Default car can not be deleted while beeping."
        });
      }

      if (c.user_id !== ctx.user.id && ctx.user.role !== 'admin') {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You don't have permission to delete another user's car."
        });
      }

      await db.delete(car).where(eq(car.id, c.id));

      if (input.reason && c.user.pushToken) {
        await sendNotification({
          to: c.user.pushToken,
          title: `${c.year} ${c.make} ${c.model} deleted`,
          body: input.reason,
        });
      }
    })
});
