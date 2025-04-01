import { createRootRoute, createRoute } from "@tanstack/react-router";
import { Entry } from "../Entry";

export const rootRoute = createRootRoute({
  component: Entry,
});

export const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/terms',
}).lazy(() => import('../routes/Terms').then(r => r.termsRoute))
