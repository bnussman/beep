import * as Sentry from "@sentry/node";
import { ENVIRONMENT, SENTRY_DSN } from "./constants.ts";

Sentry.init({
  dsn: SENTRY_DSN,
  environment: ENVIRONMENT,
  debug: true,
  tracesSampleRate: 1.0,
  tracesSampler(samplingContext) {
    return true;
  },
});
