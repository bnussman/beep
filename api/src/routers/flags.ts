import { o } from "../utils/orpc";

export const flagsRouter = {
  flags: o.handler(() => {
    return {
      liveActivities: false,
    };
  }),
};
