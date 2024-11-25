import * as Sentry from '@sentry/bun';
import { ENVIRONMENT, SENTRY_DSN } from './constants';

Sentry.init({
  dsn: SENTRY_DSN,
  environment: ENVIRONMENT,
  debug: false,
  tracesSampler(samplingContext) {
    return true;
  },
  integrations(integrations) {
    return [
      ...integrations.filter(i => i.name !== "Http"),
      Sentry.postgresIntegration(),
    ]
  },
  beforeSendTransaction(event, hint) {
    if (event.transaction && event.extra?.trpc) {
      // We must replace "." with "/" because Sentry groups requests on their end.
      // trpc's method of using `.`s insted of `/`s hurts us here.
      event.transaction = event.transaction.replaceAll('.', '/')
    }
    return event;
  }
});
