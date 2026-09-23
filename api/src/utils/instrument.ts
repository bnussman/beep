import * as Sentry from "@sentry/bun";
import { BETTER_STACK_TOKEN, BETTER_STACK_URL, ENVIRONMENT, SENTRY_DSN } from "./constants";
import { ORPCInstrumentation } from "@orpc/opentelemetry";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { PgInstrumentation } from '@opentelemetry/instrumentation-pg';
import { NodeSDK } from "@opentelemetry/sdk-node";
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { RedisInstrumentation } from '@opentelemetry/instrumentation-redis';
import {getNodeAutoInstrumentations} from "@opentelemetry/auto-instrumentations-node";


// For troubleshooting, set the log level to DiagLogLevel.DEBUG
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: BETTER_STACK_URL,
    headers: {
      Authorization: `Bearer ${BETTER_STACK_TOKEN}`
    },
  }),
  // instrumentations: [getNodeAutoInstrumentations()]
  instrumentations: [
    new ORPCInstrumentation(),
    new PgInstrumentation(),
    new RedisInstrumentation(),
  ],
});

sdk.start();

// Sentry.init({
//   dsn: SENTRY_DSN,
//   environment: ENVIRONMENT,
// });
