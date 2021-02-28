import * as Sentry from "@sentry/node";

export function initializeSentry(): void {
    Sentry.init({
        dsn: process.env.SENTRY_URL || "https://07d16e85f80f40ee941887cbd45d16eb@sentry.nussman.us/2",
        environment: process.env.GITLAB_ENVIRONMENT_NAME || "development",
        tracesSampleRate: 1.0,
        debug: false
    });
}
