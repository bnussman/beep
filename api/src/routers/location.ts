import { z } from "zod";
import { authedProcedure, router } from "../utils/trpc";
import { getCoordinatesFromAddress } from "../logic/location";
import { osrm } from "@banksnussman/osrm";
import { TRPCError } from "@trpc/server";

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
      }),
    )
    .query(async ({ input, ctx }) => {
      const [originCoordinates, destinationCoordinates] = await Promise.all([
        getCoordinatesFromAddress(input.origin, ctx.user.location),
        getCoordinatesFromAddress(input.destination, ctx.user.location),
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
});
