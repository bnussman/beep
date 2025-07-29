import React from "react";
import { useTRPC } from "../../utils/trpc";
import { createRoute } from "@tanstack/react-router";
import { adminRoute } from ".";
import { Loading } from "../../components/Loading";
import { Alert } from "@mui/material";

import { useQuery } from "@tanstack/react-query";

export const healthRoute = createRoute({
  component: Health,
  path: "health",
  getParentRoute: () => adminRoute,
});

export function Health() {
  const trpc = useTRPC();
  const { data, isLoading, error } = useQuery(trpc.health.healthcheck.queryOptions(
    undefined,
    {
      refetchInterval: 250,
    },
  ));

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
