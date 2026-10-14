import * as Sentry from "@sentry/react";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const router = createRouter({
    routeTree,
    defaultPreload: "intent",
    scrollRestoration: true,
  });

  if (!router.isServer) {
    Sentry.init({
      dsn: "https://6smjQE16ZoQ8ddVFLSZnqfYn@s2795463.us-west-2a.betterstackdata.com/2795464",
      sendDefaultPii: true,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.tanstackRouterBrowserTracingIntegration(router),
      ],
      tracesSampleRate: 1.0,
      tracePropagationTargets: [
        "localhost",
        "https://api.dev.ridebeep.app",
        "https://api.ridebeep.app",
      ],
    });
  }

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
