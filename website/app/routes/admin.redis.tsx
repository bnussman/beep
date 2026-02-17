import React from "react";
import { Loading } from "../../src/components/Loading";
import { createFileRoute } from "@tanstack/react-router";
import { useTRPC } from "../../src/utils/trpc";
import { Stack, Alert, Typography } from "@mui/material";

import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/admin/redis")({
  component: Redis,
});

export function Redis() {
  const trpc = useTRPC();
  const { data, isLoading, error } = useQuery(trpc.redis.channels.queryOptions(undefined, {
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
