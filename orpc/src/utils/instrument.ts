import { ORPCInstrumentation } from '@orpc/otel';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import {
  PeriodicExportingMetricReader,
  ConsoleMetricExporter,
} from '@opentelemetry/sdk-metrics';

const traceExporter = new OTLPTraceExporter({
  url: 'https://us-east-1.aws.edge.axiom.co/v1/traces',
  headers: {
    'Authorization': `Bearer ${process.env.AXIOM_TOKEN}`,
    'X-Axiom-Dataset': 'beep'
  },
});

const sdk = new NodeSDK({
  // traceExporter: new ConsoleSpanExporter(),
  spanProcessor: new BatchSpanProcessor(traceExporter),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new ConsoleMetricExporter(),
  }),
  instrumentations: [
    getNodeAutoInstrumentations(),
    new ORPCInstrumentation(), 
  ],
});

sdk.start();
