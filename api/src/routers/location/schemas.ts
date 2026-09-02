import z from "zod";

export const getRouteInputSchema = z.object({
  origin: z.string(),
  destination: z.string(),
  bias: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
    })
    .optional()
    .nullable(),
});

export const getSuggestionInputSchema = z.object({
  query: z.string(),
  location: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
    })
    .optional(),
});

export const getETAInputSchema = z.object({
  start: z.string(),
  end: z.string(),
});