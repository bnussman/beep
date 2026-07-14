import { z } from "zod";
import { authedProcedure, router } from "../utils/trpc.ts";
import { getCoordinatesFromAddress } from "../logic/location.ts";
import { osrm } from "@banksnussman/osrm";
import { TRPCError } from "@trpc/server";
import { photon } from "@banksnussman/photon";
import { OSRM_BASE_URL, PHOTON_BASE_URL } from "../utils/constants.ts";

export const locationRouter = router({
  getETA: authedProcedure
    .input(
      z.object({
        start: z.string(),
        end: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { data, error } = await osrm.GET(
        "/route/{version}/{profile}/{coordinates}",
        {
          baseUrl: OSRM_BASE_URL,
          params: {
            path: {
              profile: "driving",
              coordinates: `${input.start};${input.end}`,
              version: "v1",
            },
          },
        },
      );

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `${error.code} ${error.message}`,
          cause: error,
        });
      }

      const route = data.routes[0];

      if (!route) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unabe to find a route.",
        });
      }

      const eta = route.duration;

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
    .query(async ({ input, ctx }) => {
      const [originCoordinates, destinationCoordinates] = await Promise.all([
        getCoordinatesFromAddress(
          input.origin,
          input.bias ?? ctx.user.location,
        ),
        getCoordinatesFromAddress(
          input.destination,
          input.bias ?? ctx.user.location,
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

      const { data, error } = await osrm.GET(
        "/route/{version}/{profile}/{coordinates}",
        {
          baseUrl: OSRM_BASE_URL,
          params: {
            path: {
              profile: "driving",
              coordinates: `${originCoordinates.longitude},${originCoordinates.latitude};${destinationCoordinates.longitude},${destinationCoordinates.latitude}`,
              version: "v1",
            },
            query: {
              steps: true,
            },
          },
        },
      );

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
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
    .query(async ({ input, ctx }) => {
      const bias = input.location ?? ctx.user.location;

      const { data, error } = await photon.GET("/api", {
        baseUrl: PHOTON_BASE_URL,
        params: {
          query: {
            q: input.query,
            lat: bias?.latitude,
            lon: bias?.longitude,
          },
        },
      });

      if (error || !data.features[0]) {
        return [];
      }

      return data.features;
    }),
});
