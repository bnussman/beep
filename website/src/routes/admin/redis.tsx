import React from "react";
import { Loading } from "../../components/Loading";
import { createFileRoute } from "@tanstack/react-router";
import { Alert, Typography } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "../../utils/orpc";

export const Route = createFileRoute("/admin/redis")({
  component: Redis,
});

function Redis() {
  const { data, isLoading, error } = useQuery(
    orpc.redis.channels.queryOptions({
      refetchInterval: 2_000,
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

  return (
    <div className="flex flex-col gap-2">
      <Typography type="h1">
        Redis Channels
      </Typography>
      <ul>
        {data?.map((channel) => (
          <li key={channel}>{channel}</li>
        ))}
      </ul>
    </div>
  );
}
