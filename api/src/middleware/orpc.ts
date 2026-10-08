import { o } from "../services/orpc";
import { authCheckerMiddleware, authProviderMiddleware } from "./authentication";
import { isAdminMiddleware, isVerifiedMiddleware } from "./authorization";

export const authedProcedure = o
  .use(authProviderMiddleware)
  .use(authCheckerMiddleware);

export const verifiedProcedure = o
  .use(authProviderMiddleware)
  .use(authCheckerMiddleware)
  .use(isVerifiedMiddleware);

export const adminProcedure = o
  .use(authProviderMiddleware)
  .use(authCheckerMiddleware)
  .use(isAdminMiddleware);
