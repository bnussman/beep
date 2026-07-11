import { publicProcedure, router } from "../utils/trpc";

export const flagsRouter = router({
  flags: publicProcedure.query(() => {
    return {
      liveActivities: false,
    };
  }),
});
