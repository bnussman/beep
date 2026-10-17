import * as Sentry from "@sentry/react-native";
import config from "../../package.json";
import { isWeb } from "./constants";

Sentry.init({
  release: config.version,
  dsn: 'https://22da81efd1744791aa86cfd4bf8ea5eb@o1155818.ingest.us.sentry.io/6358990',
  sendDefaultPii: true,
  enableLogs: true,
  environment: __DEV__ ? "local" : "production",
  tracesSampleRate: 0.25,
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
    Sentry.reactNativeTracingIntegration({ traceFetch: true }),
    Sentry.breadcrumbsIntegration({ fetch: true }),
    Sentry.expoRouterIntegration(),
  ],
  tracePropagationTargets: isWeb
    ? [
      "localhost",
      "https://api.dev.ridebeep.app",
      "https://api.ridebeep.app"
    ]
    : undefined,
});
