import React from "react";
import { trpc } from "../../utils/trpc";
import { createRoute } from "@tanstack/react-router";
import { adminRoute } from ".";
import { Loading } from "../../components/Loading";
import { Alert } from "@mui/material";

export const healthRoute = createRoute({
  component: Health,
  path: "health",
  getParentRoute: () => adminRoute,
});

export function Health() {
  const { data, isLoading, error } = trpc.health.healthcheck.useQuery(
    undefined,
    {
      refetchInterval: 250,
    },
  );

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
