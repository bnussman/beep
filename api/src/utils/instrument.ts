import * as Sentry from "@sentry/bun";
import { ENVIRONMENT, SENTRY_DSN } from "./constants";

Sentry.init({
  dsn: SENTRY_DSN,
  environment: ENVIRONMENT,
  debug: false,
  tracesSampler(samplingContext) {
    return false;
  },
  integrations(integrations) {
    return [
      // Sentry.bunServerIntegration(),
      // Sentry.postgresIntegration(),
      // Sentry.redisIntegration(),
    ];
  },
});
