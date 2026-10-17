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
      dsn: "https://c0555c6729c4fab83598fea838e4e4ef@o1155818.ingest.us.sentry.io/4510825354428416",
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
