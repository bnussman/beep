import React from "react";
import { createRoute } from "@tanstack/react-router";
import { Details } from "./Details";
import { userRoute } from "./User";
import { Ride } from "./Ride";
import { useSubscription } from "@trpc/tanstack-react-query";
import { useTRPC } from "../../../utils/trpc";

export const userDetailsInitalRoute = createRoute({
  component: TabIndex,
  path: "/",
  getParentRoute: () => userRoute,
});

function TabIndex() {
  const trpc = useTRPC();

  const { userId } = userDetailsInitalRoute.useParams();
  const { data: ride } = useSubscription(trpc.rider.currentRideUpdates.subscriptionOptions(userId));

  if (ride) {
    return <Ride />;
  }

  return <Details />
}

