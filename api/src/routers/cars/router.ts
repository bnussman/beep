import { z } from "zod";
import { db } from "../../utils/db";
import { cars } from "../../../drizzle/schema";
import { s3 } from "../../utils/s3";
import { ORPCError } from "@orpc/server";
import { condensedUserColumns } from "../users/logic";
import { sendNotification } from "../../utils/notifications";
import { and, count, eq, ne } from "drizzle-orm";
import { S3_BUCKET_URL } from "../../utils/constants";
import { getMakes, getModels } from "car-info";
import { CAR_COLOR_OPTIONS } from "../../utils/constants";
import {
  authedProcedure,
  o,
  verifiedProcedure,
  withLock,
} from "../../utils/orpc";
import {
  createCarInputSchema,
  deleteCarInputSchema,
  getCarsInputSchema,
  updateCarInputSchema
} from "./schemas";
import { getOffsetFromPage, getPagesFromCount } from "../../utils/pagination";

export const carRouter = {
  cars: authedProcedure
    .input(getCarsInputSchema)
    .handler(async ({ input }) => {
      const where = input.userId ? { user_id: input.userId } : {};

      const [cars, countData] = await Promise.all([
        db.query.cars.findMany({
          limit: input.pageSize,
          offset: getOffsetFromPage(input.cursor, input.pageSize),
          orderBy: { created: "desc" },
          where: input.userId ? { user_id: input.userId } : {},
          with: {
            user: {
              columns: condensedUserColumns,
            },
          },
        }),
        db.query.cars.findMany({
          columns: {},
          extras: { count: count() },
          where,
        }),
      ]);

      const results = countData[0].count;

      return {
        cars,
        page: input.cursor,
        pageSize: input.pageSize,
        pages: getPagesFromCount(results, input.pageSize),
        results,
      };
    }),
  deleteCar: authedProcedure
    .input(deleteCarInputSchema)
    .handler(async ({ input, context }) => {
      if (context.user.role !== "admin" && input.reason) {
        throw new ORPCError("BAD_REQUEST",  {
          message: "Only admins can specify a reason.",
        });
      }

      const car = await db.query.cars.findFirst({
        where: { id: input.carId },
        with: {
          user: true,
        },
      });

      if (!car) {
        throw new ORPCError("NOT_FOUND", {
          message: "Car not found",
        });
      }

      if (car.default && car.user.isBeeping) {
        throw new ORPCError("BAD_REQUEST", {
          message: "Default car can not be deleted while beeping.",
        });
      }

      if (car.user_id !== context.user.id && context.user.role !== "admin") {
        throw new ORPCError("UNAUTHORIZED", {
          message: "You don't have permission to delete another user's car.",
        });
      }

      await db.delete(cars).where(eq(cars.id, car.id));

      const key = car.photo.split(S3_BUCKET_URL)[1];
      await s3.delete(key);

      if (input.reason && car.user.pushToken) {
        await sendNotification({
          to: car.user.pushToken,
          title: `${car.year} ${car.make} ${car.model} deleted`,
          body: input.reason,
        });
      }
    }),
  createCar: verifiedProcedure
    .use(withLock)
    .input(createCarInputSchema)
    .handler(async ({ input, context }) => {
      const validModels = getModels(input.make as string) as string[];

      if (!validModels.includes(input.model)) {
        throw new ORPCError("BAD_REQUEST", {
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

      const car = {
        id: carId,
        ...input,
        year: input.year,
        user_id: context.user.id,
        photo: S3_BUCKET_URL + objectKey,
        default: true,
        created: new Date(),
        updated: new Date(),
      };

      await db.insert(cars).values(car);

      await db
        .update(cars)
        .set({ default: false })
        .where(
          and(
            eq(cars.user_id, context.user.id),
            ne(cars.id, car.id)
          )
        );

      return car;
    }),
  updateCar: authedProcedure
    .input(updateCarInputSchema)
    .handler(async ({ input }) => {
      const [car] = await db
        .update(cars)
        .set(input.data)
        .where(eq(cars.id, input.carId))
        .returning();

      if (input.data.default) {
        await db
          .update(cars)
          .set({ default: false })
          .where(
            and(
              ne(cars.id, input.carId),
              eq(cars.user_id, car.user_id))
          );
      }

      return car;
    }),
  getColors: o.handler(() => {
    return CAR_COLOR_OPTIONS;
  }),
  getMakes: o.handler(() => {
    return getMakes();
  }),
  getModels: o.input(z.string()).handler(({ input }) => {
    return getModels(input) as string[];
  }),
};
