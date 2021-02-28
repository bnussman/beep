import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";

export function initializeSentry(): void {
    Sentry.init({
        dsn: process.env.SENTRY_URL || "https://f8d119dccd214f13ada901136f2f5e61@sentry.nussman.us/3",
        environment: process.env.GITLAB_ENVIRONMENT_NAME || "development",
        tracesSampleRate: 1.0
    });
}

