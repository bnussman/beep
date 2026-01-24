import React from "react";
import { Loading } from "../../components/Loading";
import { createRoute } from "@tanstack/react-router";
import { adminRoute } from ".";
import { Stack, Alert, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "../../utils/orpc";

export const redisRoute = createRoute({
  component: Redis,
  path: "redis",
  getParentRoute: () => adminRoute,
});

export function Redis() {
  const { data, isLoading, error } = useQuery(orpc.redis.channels.queryOptions({
    refetchInterval: 2_000,
  }));

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
