import { z } from "zod";
import { authedProcedure } from "../utils/trpc";
import { getCoordinatesFromAddress } from "../logic/location";
import { osrm } from "@banksnussman/osrm";
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
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          message: `${error.code} ${error.message}`,
          cause: error,
        });
      }

      const route = data.routes[0];

      if (!route) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
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
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          message: `${error.code} ${error.message}`,
          cause: error,
        });
      }

      return data;
    }),
};
