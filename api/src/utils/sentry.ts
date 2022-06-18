import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import { Router } from 'express';
import { User } from '../entities/User';
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
      new Tracing.Integrations.Express({ app }),
      // new Tracing.Integrations.Apollo(),
      new Tracing.Integrations.GraphQL(),
      new Tracing.Integrations.Postgres(),
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

export function setUserContext(user: Partial<User>): void {
  Sentry.setUser(user);
}

export function captureError(e: any): void {
  Sentry.captureException(e);
}
