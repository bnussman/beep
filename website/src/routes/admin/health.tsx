import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loading } from "../../components/Loading";
import { Alert } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "../../utils/orpc";

export const Route = createFileRoute("/admin/health")({
  component: Health,
});

function Health() {
  const { data, isLoading, error } = useQuery(
    orpc.health.healthcheck.queryOptions({
      refetchInterval: 250,
    }),
  );

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
