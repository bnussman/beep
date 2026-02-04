import { createRootRoute } from "@tanstack/react-router";
import { Entry } from "../Entry";

export const rootRoute = createRootRoute({
  component: Entry,
});
