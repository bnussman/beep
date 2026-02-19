import { createRoute } from "@tanstack/react-router";
import { Details } from "./Details";
import { userRoute } from "./User";

export const userDetailsInitalRoute = createRoute({
  component: Details,
  path: "/",
  getParentRoute: () => userRoute,
});
