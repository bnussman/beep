import * as Sentry from "@sentry/bun";
import { ENVIRONMENT, SENTRY_DSN } from "./constants";

Sentry.init({
  dsn: SENTRY_DSN,
  environment: ENVIRONMENT,
  debug: true,
  tracesSampler(samplingContext) {
    return true;
  },
  integrations(integrations) {
    return [
      Sentry.bunServerIntegration(),
      Sentry.postgresIntegration(),
      Sentry.redisIntegration(),
    ];
  },
});
