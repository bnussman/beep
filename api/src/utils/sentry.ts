import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import { Router } from 'express';
import { User } from '../entities/User';
import packageConfig from '../../package.json';

export function init(app: Router): void {
  Sentry.init({
    release: packageConfig.version,
    dsn: process.env.SENTRY_URL,
    environment: process.env.GITLAB_ENVIRONMENT_NAME || "development",
    tracesSampleRate: 1.0,
    debug: true,
    autoSessionTracking: true, 
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Tracing.Integrations.Express({ app }),
    ],
  });
}

export function setUserContext(user: Partial<User>): void {
  Sentry.setUser(user);
}

export function captureError(e: any): void {
  Sentry.captureException(e);
}