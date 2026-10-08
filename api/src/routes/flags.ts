import { o } from "../services/orpc";
import { authProviderMiddleware } from "../middleware/authentication";

export const flagsRouter = {
  flags: o
    .use(authProviderMiddleware)
    .handler(({ context }) => {
      return {
        liveActivities: context.user?.role === "admin" || context.user?.email.includes('@test.edu'),
      };
    }),
};
