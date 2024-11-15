import * as Sentry from '@sentry/bun';
import { ENVIRONMENT, SENTRY_DSN } from './constants';

Sentry.init({
  dsn: SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: ENVIRONMENT,
  integrations(integrations) {
    console.log(integrations)
    return [
      ...integrations.filter(i => i.name !== "Http"),
      Sentry.postgresIntegration()
    ]
  }
});
