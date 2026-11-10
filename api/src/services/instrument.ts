import * as Sentry from "@sentry/bun";
import { ENVIRONMENT, isDevelopment, SENTRY_DSN } from "../utilities/constants";
import { ORPCInstrumentation } from "@orpc/opentelemetry";
import { registerInstrumentations } from "@opentelemetry/instrumentation";

Sentry.init({
  dsn: SENTRY_DSN,
  environment: ENVIRONMENT,
  debug: false,
  tracesSampleRate: isDevelopment ? 1 : 0.1,
  // v11 no longer registers an OpenTelemetry tracer provider by default. oRPC emits its spans
  // through `@opentelemetry/api`, so opt in to have them captured as Sentry spans.
  enableOpenTelemetrySetup: true,
  // `sendDefaultPii` was never set, so keep the restrictive v10 collection defaults explicitly
  // (v11 collects everything when `dataCollection` is unset).
  dataCollection: {
    userInfo: false,
    cookies: false,
    httpHeaders: {
      request: { deny: ["forwarded", "-ip", "remote-", "via", "-user"] },
      response: { deny: ["forwarded", "-ip", "remote-", "via", "-user"] },
    },
    httpBodies: [],
    urlQueryParams: { deny: ["forwarded", "-ip", "remote-", "via", "-user"] },
    genAI: { inputs: false, outputs: false },
    databaseQueryData: false,
    graphQL: { document: false, variables: false },
  },
  integrations() {
    return [
      // Sentry.bunRuntimeMetricsIntegration(),
      Sentry.bunServerIntegration(),
      Sentry.fetchIntegration(),
      Sentry.postgresIntegration(),
      Sentry.redisIntegration(),
    ];
  },
});

// `openTelemetryInstrumentations` was removed in v11; register OpenTelemetry instrumentations
// directly against the tracer provider that `enableOpenTelemetrySetup` installed.
registerInstrumentations({
  instrumentations: [
    new ORPCInstrumentation({
      propagation: false,
    }),
  ],
});
