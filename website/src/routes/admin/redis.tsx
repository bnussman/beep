import React from "react";
import { Loading } from "../../components/Loading";
import { createFileRoute, createRoute } from "@tanstack/react-router";
import { Typography } from "@heroui/react";
import { Alert } from "@mui/material";
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
    return <Alert severity="error">{error.message}</Alert>;
  }

  return (
    <div className="flex flex-col gap-2">
      <Typography type="h1">
        Redis Channels
      </Typography>
      <ul style={{ paddingLeft: 20 }}>
        {data?.map((channel) => (
          <li key={channel}>{channel}</li>
        ))}
      </ul>
    </div>
  );
}
