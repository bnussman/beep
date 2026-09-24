import * as Sentry from "@sentry/react-native";
import config from "../../package.json";
import { isWeb } from "./constants";

Sentry.init({
  release: config.version,
  dsn: "https://22da81efd1744791aa86cfd4bf8ea5eb@o1155818.ingest.sentry.io/6358990",
  tracesSampleRate: 0.5,
  integrations: [
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
