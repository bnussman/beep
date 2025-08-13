import { z } from "zod";
import { authedProcedure, router } from "../utils/trpc";
import { OSRM } from "../utils/osrm";

export const locationRouter = router({
  getETA: authedProcedure
    .input(
      z.object({
        start: z.string(),
        end: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const result = await fetch(
        `https://osrm.ridebeep.app/route/v1/driving/${input.start};${input.end}`,
      );

      const data: OSRM["/route/{version}/{profile}/{coordinates}"]["get"]["responses"]["200"]["content"]["application/json"] =
        await result.json();

      const eta = data?.routes?.[0]?.duration;

      if (eta === undefined) {
        // Sentry.captureMessage("ETA from https://osrm.ridebeep.app was undefined");
        throw new Error("ETA Unavailable");
      }

      const etaMinutes = Math.round(eta / 60);

      return `${etaMinutes} min`;
    }),
});
