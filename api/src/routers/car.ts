import { z } from "zod";
import { authedProcedure, router, verifiedProcedure } from "../utils/trpc";
import { db } from "../utils/db";
import { car } from "../../drizzle/schema";
import { and, count, desc, eq, ne } from 'drizzle-orm';
import { TRPCError } from "@trpc/server";
import { sendNotification } from "../utils/notifications";
import { s3 } from "../utils/s3";
import { S3_BUCKET_URL } from "../utils/constants";

export const carRouter = router({
  cars: authedProcedure
    .input(
      z.object({
        show: z.number(),
        cursor: z.number().optional(),
        userId: z.string().optional()
      })
    )
    .query(async ({ input }) => {
      const where = input.userId ? eq(car.user_id, input.userId) : undefined;

      const cars = await db.query.car.findMany({
        limit: input.show,
        offset: input.cursor,
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
    }),
  createCar: verifiedProcedure
    .input(z.instanceof(FormData))
    .mutation(async ({ input: formData, ctx }) => {
      const object = {} as Record<string, unknown>;

      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          object[key] = value;
        } else {
          object[key] = value;
        }
      }

      const carSchema = z.object({
        make: z.string(),
        model: z.string(),
        year: z.string(),
        color: z.string().toLowerCase(),
        photo: z.instanceof(File),
      });

      const {
        success,
        data: input,
        error
      } = carSchema.safeParse(object);

      if (!success) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          cause: error,
        });
      }

      const carId = crypto.randomUUID();

      const extention = input.photo.name.substring(
        input.photo.name.lastIndexOf("."),
        input.photo.name.length,
      );

      const objectKey = `cars/${carId}${extention}`;

      await s3.write(objectKey, input.photo, {
        acl: "public-read",
      });

      const newCar = {
        id: carId,
        ...input,
        year: Number(input.year),
        user_id: ctx.user.id,
        photo: S3_BUCKET_URL + objectKey,
        default: true,
        created: new Date(),
        updated: new Date()
      };

      await db.insert(car).values(newCar);
      await db.update(car)
        .set({ default: false })
        .where(
          and(
            eq(car.user_id, ctx.user.id),
            ne(car.id, newCar.id)
          )
        );

      return newCar;
    }),
  updateCar: authedProcedure
    .input(
      z.object({
        carId: z.string(),
        data: z.object({
          default: z.boolean()
        })
      })
    )
    .mutation(async ({ input }) => {
      const c = await db.update(car).set(input.data).where(eq(car.id, input.carId)).returning();

      if (input.data.default) {
        await db.update(car)
          .set({ default: false })
          .where(
            and(
              ne(car.id, input.carId),
              eq(car.user_id, c[0].user_id)
            )
          );
      }

      return c[0];
    })
});
