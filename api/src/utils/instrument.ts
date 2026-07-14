import * as Sentry from "@sentry/node";
import { ENVIRONMENT, SENTRY_DSN } from "./constants.ts";

Sentry.init({
  dsn: SENTRY_DSN,
  environment: ENVIRONMENT,
  debug: false,
  tracesSampler(samplingContext) {
    return true;
  },
});
