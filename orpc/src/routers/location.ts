import { z } from "zod";
import { authedProcedure } from "../utils/orpc";
import { getCoordinatesFromAddress } from "../logic/location";
import { route } from "@banksnussman/osrm";
import { OSRM_BASE_URL, PHOTON_BASE_URL } from "../utils/constants";
import { geocoding } from "@banksnussman/photon";
import { ORPCError } from "@orpc/server";

export const locationRouter = {
  getETA: authedProcedure
    .input(
      z.object({
        start: z.string(),
        end: z.string(),
      }),
    )
    .handler(async ({ input }) => {
      const { data, error } = await route({
          baseUrl: OSRM_BASE_URL,
          path: {
            profile: "driving",
            coordinates: `${input.start};${input.end}`,
            version: "v1",
          },
        },
      );

      if (error) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          message: `${error.code} ${error.message}`,
          cause: error,
        });
      }

      const routeData = data.routes[0];

      if (!routeData) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          message: "Unabe to find a route.",
        });
      }

      const eta = routeData.duration;

      const etaMinutes = Math.round(eta / 60);

      return `${etaMinutes} min`;
    }),
  getRoute: authedProcedure
    .input(
      z.object({
        origin: z.string(),
        destination: z.string(),
        bias: z
          .object({
            latitude: z.number(),
            longitude: z.number(),
          })
          .optional()
          .nullable(),
      }),
    )
    .handler(async ({ input, context }) => {
      const [originCoordinates, destinationCoordinates] = await Promise.all([
        getCoordinatesFromAddress(
          input.origin,
          input.bias ?? context.user.location,
        ),
        getCoordinatesFromAddress(
          input.destination,
          input.bias ?? context.user.location,
        ),
      ]);

      if (!originCoordinates) {
        throw new Error(
          "Unable to determine coordinates for the origin location.",
        );
      }

      if (!destinationCoordinates) {
        throw new Error(
          "Unable to determine coordinates for the destination location.",
        );
      }

      const { data, error } = await route({
        baseUrl: OSRM_BASE_URL,
        path: {
          profile: "driving",
          coordinates: `${originCoordinates.longitude},${originCoordinates.latitude};${destinationCoordinates.longitude},${destinationCoordinates.latitude}`,
          version: "v1",
        },
        query: {
          steps: true,
        },
      });

      if (error) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          message: `${error.code} ${error.message}`,
          cause: error,
        });
      }

      return data;
    }),
  getSuggestions: authedProcedure
    .input(
      z.object({
        query: z.string(),
        location: z
          .object({
            latitude: z.number(),
            longitude: z.number(),
          })
          .optional(),
      }),
    )
    .handler(async ({ input, context }) => {
      const bias = input.location ?? context.user.location;

      const { data, error } = await geocoding({
        baseUrl: PHOTON_BASE_URL,
        query: {
          q: input.query,
          lat: bias?.latitude,
          lon: bias?.longitude,
        },
      });

      if (error || !data?.features[0]) {
        return [];
      }

      return data.features;
    }),
};
