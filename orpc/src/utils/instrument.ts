import * as Sentry from "@sentry/bun";
import { ENVIRONMENT, SENTRY_DSN } from "./constants";

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
    { op: "http.client", name: `${method} ${url}` },
    async (span) => {
      const baseUrl = typeof globalThis.location?.origin === "string" ? globalThis.location.origin : "http://localhost";
      const parsedUrl = new URL(url, baseUrl);

      span.setAttribute("http.request.method", method);
      span.setAttribute("server.address", parsedUrl.hostname);
      if (parsedUrl.port) {
        span.setAttribute("server.port", parsedUrl.port);
      }

      const response = await originalFetch(...args);
      span.setAttribute("http.response.status_code", response.status);

      const contentLength = response.headers.get("content-length");
      if (contentLength) {
        span.setAttribute("http.response_content_length", Number(contentLength));
      }

      return response;
    },
  );
}) as typeof globalThis.fetch;

Sentry.init({
  dsn: SENTRY_DSN,
  environment: ENVIRONMENT,
  debug: false,
  tracesSampler(samplingContext) {
    return true;
  },
  integrations(integrations) {
    return [
      Sentry.bunRuntimeMetricsIntegration(),
      Sentry.bunServerIntegration(),
      Sentry.postgresIntegration(),
      Sentry.redisIntegration(),
    ];
  },
});
