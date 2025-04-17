import React from "react";
import { Loading } from "../../components/Loading";
import { createRoute } from "@tanstack/react-router";
import { adminRoute } from ".";
import { trpc } from "../../utils/trpc";
import { Stack, Alert, Typography } from "@mui/material";

export const redisRoute = createRoute({
  component: Redis,
  path: "redis",
  getParentRoute: () => adminRoute,
});

export function Redis() {
  const { data, isLoading, error } = trpc.redis.channels.useQuery(undefined, {
    refetchInterval: 2_000,
  });

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return (
    <Stack spacing={1}>
      <Typography variant="h4" fontWeight="bold">
        Redis Channels
      </Typography>
      <ul style={{ paddingLeft: 20 }}>
        {data?.map((channel) => <li>{channel}</li>)}
      </ul>
    </Stack>
  );
}
