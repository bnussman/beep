import { createRouter } from "@tanstack/react-router";
import { NotFound } from "../components/NotFound";
import { routeTree } from "./routeTree";

export const router = createRouter({ routeTree, defaultNotFoundComponent: NotFound });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
