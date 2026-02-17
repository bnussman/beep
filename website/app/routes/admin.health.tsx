import React from "react";
import { useTRPC } from "../../src/utils/trpc";
import { createFileRoute } from "@tanstack/react-router";
import { Loading } from "../../src/components/Loading";
import { Alert } from "@mui/material";

import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/admin/health")({
  component: Health,
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
