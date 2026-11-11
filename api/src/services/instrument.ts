import * as Sentry from "@sentry/bun";
import { sentryBunPlugin } from "@sentry/bun/plugin";
import { ENVIRONMENT, isDevelopment, SENTRY_DSN } from "../utilities/constants";
import { ORPCInstrumentation } from "@orpc/opentelemetry";
import { registerInstrumentations } from "@opentelemetry/instrumentation";

/**
 * Register Sentry's Bun plugin as a *runtime* plugin so library instrumentation
 * (e.g. `pg`) works without a `Bun.build` step.
 *
 * Sentry v11 instruments libraries by rewriting them to emit diagnostics channels.
 * Officially that only happens when bundling with `sentryBunPlugin()`, but the
 * transform runs through Bun's standard `onLoad` hooks, which `Bun.plugin()` also
 * applies to every module loaded after this point. That's why this file must be
 * `--preload`ed, and none of the imports above may load an instrumented library.
 *
 * Not an officially supported setup: if Postgres spans disappear after a Sentry
 * upgrade, this is the first place to look.
 */
Bun.plugin(
  sentryBunPlugin({
    telemetry: false,
    // Source map upload / release injection are build-time concerns; skip them at runtime.
    sourcemaps: { disable: true },
  }),
);

// Sentry decides at init whether injection happened by looking for a marker that the
// plugin only sets as a bundle banner (which runtime plugins never emit). Set it here
// so Sentry doesn't log a misleading "No diagnostics-channel injection detected" warning.
const orchestrion = ((globalThis as any).__SENTRY_ORCHESTRION__ ??= {});
orchestrion.bundler ??= new Set<string>();

Sentry.init({
  dsn: SENTRY_DSN,
  environment: ENVIRONMENT,
  debug: true,
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
