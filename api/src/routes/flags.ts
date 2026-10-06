import { o } from "../services/orpc";

export const flagsRouter = {
  flags: o.handler(({ context }) => {
    return {
      liveActivities: context.user?.role === "admin" || context.user?.email.includes('@test.edu'),
    };
  }),
};
