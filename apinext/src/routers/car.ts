import { z } from "zod";
import { adminProcedure, router } from "../utils/trpc";
import { db } from "../utils/db";
import { car } from "../../drizzle/schema";
import { count, desc, eq } from 'drizzle-orm';

export const carRouter = router({
  cars: adminProcedure
    .input(
      z.object({
        show: z.number(),
        offset: z.number(),
      })
    )
    .query(async ({ input }) => {
      const cars = await db.query.car.findMany({
        limit: input.show,
        offset: input.offset,
        orderBy: desc(car.created),
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

      const carsCount = await db.select({ count: count() }).from(car);

      return {
        cars,
        count: carsCount[0].count
      }
    })
});
