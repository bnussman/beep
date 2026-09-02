import { authedProcedure } from "../../utils/orpc";
import { route } from "@banksnussman/osrm";
import { OSRM_BASE_URL, PHOTON_BASE_URL } from "../../utils/constants";
import { geocoding } from "@banksnussman/photon";
import { getCoordinatesFromAddress } from "./logic";
import { getETAInputSchema, getRouteInputSchema, getSuggestionInputSchema } from "./schemas";

export const locationRouter = {
  getETA: authedProcedure
    .input(getETAInputSchema)
    .handler(async ({ input }) => {
      const { data } = await route({
        baseUrl: OSRM_BASE_URL,
        throwOnError: true,
        path: {
          profile: "driving",
          coordinates: `${input.start};${input.end}`,
          version: "v1",
        },
      });

      const routeData = data.routes[0];

      if (!routeData) {
        throw new Error("No routes retuned from OSRM");
      }

      const eta = routeData.duration;

      const etaMinutes = Math.round(eta / 60);

      return `${etaMinutes} min`;
    }),
  getRoute: authedProcedure
    .input(getRouteInputSchema)
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

      const { data } = await route({
        baseUrl: OSRM_BASE_URL,
        throwOnError: true,
        path: {
          profile: "driving",
          coordinates: `${originCoordinates.longitude},${originCoordinates.latitude};${destinationCoordinates.longitude},${destinationCoordinates.latitude}`,
          version: "v1",
        },
        query: {
          steps: true,
        },
      });

      return data;
    }),
  getSuggestions: authedProcedure
    .input(getSuggestionInputSchema)
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
