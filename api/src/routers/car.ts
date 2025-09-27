import { z } from "zod";
import {
  authedProcedure,
  publicProcedure,
  router,
  verifiedProcedure,
} from "../utils/trpc";
import { db } from "../utils/db";
import { car } from "../../drizzle/schema";
import { and, count, desc, eq, ne } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { sendNotification } from "../utils/notifications";
import { s3 } from "../utils/s3";
import { DEFAULT_PAGE_SIZE, S3_BUCKET_URL } from "../utils/constants";
import { getMakes, getModels } from "car-info";
import { CAR_COLOR_OPTIONS } from "../utils/constants";

export const carRouter = router({
  cars: authedProcedure
    .input(
      z.object({
        pageSize: z.number().default(DEFAULT_PAGE_SIZE),
        cursor: z.number().optional().default(1),
        userId: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const where = input.userId ? eq(car.user_id, input.userId) : undefined;

      const cars = await db.query.car.findMany({
        limit: input.pageSize,
        offset: (input.cursor - 1) * input.pageSize,
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
          },
        },
      });

      const carsCount = await db
        .select({ count: count() })
        .from(car)
        .where(where);

      const results = carsCount[0].count;

      return {
        cars,
        page: input.cursor,
        pageSize: input.pageSize,
        pages: Math.ceil(results / input.pageSize),
        results,
      };
    }),
  deleteCar: authedProcedure
    .input(
      z.object({
        carId: z.string(),
        reason: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin" && input.reason) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Only admins can specify a reason.",
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
          message: "Car not found",
        });
      }

      if (c.default && c.user.isBeeping) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Default car can not be deleted while beeping.",
        });
      }

      if (c.user_id !== ctx.user.id && ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You don't have permission to delete another user's car.",
        });
      }

      await db.delete(car).where(eq(car.id, c.id));

      const key = c.photo.split(S3_BUCKET_URL)[1];
      await s3.delete(key);

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
      const carSchema = z.object({
        make: z.enum(getMakes()),
        model: z.string(),
        year: z.string(),
        color: z.enum(CAR_COLOR_OPTIONS),
        photo: z.instanceof(File),
      });

      const {
        success,
        data: input,
        error,
      } = carSchema.safeParse(Object.fromEntries(formData.entries()));

      if (!success) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          cause: error,
        });
      }

      const validModels = getModels(input.make as string) as string[];

      if (!validModels.includes(input.model)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `The selected model (${input.model}) is not valid for the selected make (${input.make}).`,
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
        updated: new Date(),
      };

      await db.insert(car).values(newCar);
      await db
        .update(car)
        .set({ default: false })
        .where(and(eq(car.user_id, ctx.user.id), ne(car.id, newCar.id)));

      return newCar;
    }),
  updateCar: authedProcedure
    .input(
      z.object({
        carId: z.string(),
        data: z.object({
          default: z.boolean(),
        }),
      }),
    )
    .mutation(async ({ input }) => {
      const c = await db
        .update(car)
        .set(input.data)
        .where(eq(car.id, input.carId))
        .returning();

      if (input.data.default) {
        await db
          .update(car)
          .set({ default: false })
          .where(and(ne(car.id, input.carId), eq(car.user_id, c[0].user_id)));
      }

      return c[0];
    }),
  getColors: publicProcedure.query(() => {
    return CAR_COLOR_OPTIONS;
  }),
  getMakes: publicProcedure.query(() => {
    return getMakes();
  }),
  getModels: publicProcedure.input(z.string()).query(({ input }) => {
    return getModels(input) as string[];
  }),
});
