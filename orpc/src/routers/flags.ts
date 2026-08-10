import { o } from "../utils/trpc";

export const flagsRouter = {
  flags: o.handler(() => {
    return {
      liveActivities: false,
    };
  }),
};
