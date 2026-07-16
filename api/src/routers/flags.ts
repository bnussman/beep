import { publicProcedure, router } from "../utils/trpc.ts";

export const flagsRouter = router({
  flags: publicProcedure.query(() => {
    return {
      liveActivities: false,
    };
  }),
});
