import * as Sentry from "@sentry/bun";
import { ENVIRONMENT, isDevelopment, SENTRY_DSN } from "../utilities/constants";
import { ORPCInstrumentation } from "@orpc/opentelemetry";
import { registerInstrumentations } from "@opentelemetry/instrumentation";

const originalFetch: typeof globalThis.fetch = globalThis.fetch.bind(globalThis);

globalThis.fetch = (async (...args: Parameters<typeof globalThis.fetch>) => {
  const [input, init] = args;
  const method = (init?.method ?? (input instanceof Request ? input.method : "GET")).toUpperCase();
  const url =
    typeof input === "string"
      ? input
      : input instanceof URL
        ? input.toString()
        : input.url;

  return Sentry.startSpan(
    {
      op: "http.client",
      // v11 span naming convention: low-cardinality `METHOD host`; the full URL lives on `url.full`
      name: `${method} ${new URL(url, globalThis.location?.origin ?? "http://localhost").host}`,
    },
    async (span) => {
      const baseUrl = typeof globalThis.location?.origin === "string" ? globalThis.location.origin : "http://localhost";
      const parsedUrl = new URL(url, baseUrl);

      span.setAttribute("http.request.method", method);
      span.setAttribute("url.full", parsedUrl.toString());
      span.setAttribute("server.address", parsedUrl.hostname);
      if (parsedUrl.port) {
        span.setAttribute("server.port", parsedUrl.port);
      }

      const response = await originalFetch(...args);
      span.setAttribute("http.response.status_code", response.status);

      const contentLength = response.headers.get("content-length");
      if (contentLength) {
        span.setAttribute("http.response.body.size", Number(contentLength));
      }

      return response;
    },
  );
}) as typeof globalThis.fetch;

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
