import * as Sentry from '@sentry/node';
import { Router } from 'express';
import { SENTRY_URL, ENVIRONMENT } from './constants';

export function init(app: Router): void {
  Sentry.init({
    dsn: SENTRY_URL,
    environment: ENVIRONMENT || "development",
    tracesSampleRate: 1.0,
    debug: false,
    autoSessionTracking: true, 
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Sentry.Integrations.Express({ app }),
      // new Tracing.Integrations.Apollo(),
      new Sentry.Integrations.GraphQL(),
      new Sentry.Integrations.Postgres(),
    ],
    tracesSampler: (samplingContext) => {
      if (samplingContext.request?.method === 'OPTIONS') {
        return false;
      }
      if (samplingContext?.transactionContext?.name === 'GET /.well-known/apollo/server-health') {
        return false;
      }
      return true;
    },
  });
}