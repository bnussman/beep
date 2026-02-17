import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { NotFound } from "../src/components/NotFound";

export function createRouter() {
  const router = createTanStackRouter({ 
    routeTree, 
    defaultNotFoundComponent: NotFound 
  });

  return router;
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}
