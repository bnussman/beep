import * as Sentry from "@sentry/bun";
import { ENVIRONMENT, isDevelopment, SENTRY_DSN } from "../utilities/constants";
import { ORPCInstrumentation } from "@orpc/opentelemetry";
import { registerInstrumentations } from "@opentelemetry/instrumentation";

Sentry.init({
  dsn: SENTRY_DSN,
  environment: ENVIRONMENT,
  debug: false,
  tracesSampleRate: isDevelopment ? 1 : 0.1,
  enableOpenTelemetrySetup: true,
  integrations() {
    return [
      Sentry.bunServerIntegration(),
      Sentry.fetchIntegration(),
      Sentry.postgresIntegration(),
      Sentry.redisIntegration(),
    ];
  },
});

registerInstrumentations({
  instrumentations: [
    new ORPCInstrumentation({
      propagation: false,
    }),
  ],
});
