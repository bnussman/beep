import z from "zod";
import { getMakes } from "car-info";
import { CAR_COLOR_OPTIONS } from "../../utils/constants";

export const createCarInputSchema =
  z.object({
    make: z.enum(getMakes()),
    model: z.string(),
    year: z.number(),
    color: z.enum(CAR_COLOR_OPTIONS),
    photo: z.instanceof(File),
  });

export const deleteCarInputSchema =
  z.object({
    carId: z.string(),
    reason: z.string().optional(),
  });

export const getCarsInputSchema =
  z.object({
    userId: z.uuid().optional(),
  });

export const updateCarInputSchema =
  z.object({
    carId: z.string(),
    data: z.object({
      default: z.boolean(),
    }),
  });