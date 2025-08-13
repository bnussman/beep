import { z } from "zod";
import { authedProcedure, router } from "../utils/trpc";
import { getCoordinatesFromAddress, getRoute } from "../logic/location";

export const locationRouter = router({
  getETA: authedProcedure
    .input(
      z.object({
        start: z.string(),
        end: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const route = await getRoute(input.start, input.end);

      const eta = route?.routes?.[0]?.duration;

      if (eta === undefined) {
        throw new Error("No route found.");
      }

      const etaMinutes = Math.round(eta / 60);

      return `${etaMinutes} min`;
    }),
  getCoordinatesFromAddress: authedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const coordinates = await getCoordinatesFromAddress(
        input,
        ctx.user.location,
      );

      return coordinates;
    }),
});
