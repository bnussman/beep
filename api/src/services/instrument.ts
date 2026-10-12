import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions'
import { NodeSDK } from '@opentelemetry/sdk-node';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { ORPCInstrumentation } from '@orpc/opentelemetry'
import { RedisInstrumentation } from '@opentelemetry/instrumentation-redis';
import { PgInstrumentation } from '@opentelemetry/instrumentation-pg';

const exporter = new OTLPTraceExporter({
  url: 'https://us.i.posthog.com/i/v1/traces',
  headers: {
    Authorization: `Bearer ${process.env.POSTHOG_API_KEY}`,
  },
})

const sdk = new NodeSDK({
  instrumentations: [
    new ORPCInstrumentation(), 
    new RedisInstrumentation(),
    new PgInstrumentation(),
  ],
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: 'beep-api',
  }),
  spanProcessors: [new BatchSpanProcessor(exporter)],
  
});

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

sdk.start();
