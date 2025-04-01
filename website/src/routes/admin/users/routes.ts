import { createRoute } from "@tanstack/react-router";
import { adminRoute } from "..";

export const usersRoute = createRoute({
  path: "users",
  getParentRoute: () => adminRoute,
});
