import * as Sentry from "@sentry/bun";
import { ENVIRONMENT, SENTRY_DSN } from "./constants";
import { ORPCInstrumentation } from '@orpc/otel';

Sentry.init({
  dsn: SENTRY_DSN,
  environment: ENVIRONMENT,
  sendDefaultPii: true,
  tracesSampleRate: 1.0,
  tracesSampler(samplingContext) {
    return true;
  },
  integrations(integrations) {
    return [
      ...integrations,
      Sentry.postgresIntegration(),
      Sentry.redisIntegration(),
    ];
  },
  openTelemetryInstrumentations: [
    new ORPCInstrumentation()
  ]
});
