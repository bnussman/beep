import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loading } from "../../components/Loading";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "../../utils/orpc";
import { Alert } from "@heroui/react";

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
    return (
      <Alert status="danger">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>Error</Alert.Title>
          <Alert.Description>
            {error.message}
          </Alert.Description>
        </Alert.Content>
      </Alert>
    )
  }

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
