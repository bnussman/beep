import * as Sentry from "@sentry/react-native";
import config from "../../package.json";
import { isWeb } from "./constants";

Sentry.init({
  release: config.version,
  dsn: "https://XAiQXk5ndTy6tJCv2cmKpGep@s2795462.us-west-2a.betterstackdata.com/2795471",
  environment: __DEV__ ? "local" : "production",
  tracesSampleRate: 1,
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
