import { authProviderMiddleware } from "../middleware/orpc";
import { o } from "../services/orpc";

export const flagsRouter = {
  flags: o
    .use(authProviderMiddleware)
    .handler(({ context }) => {
      return {
        liveActivities: context.user?.role === "admin" || context.user?.email.includes('@test.edu'),
      };
    }),
};
