import React from "react";
import { Heading, ListItem, Stack, UnorderedList } from "@chakra-ui/react";
import { Loading } from "../../components/Loading";
import { Error } from "../../components/Error";
import { createRoute } from "@tanstack/react-router";
import { adminRoute } from ".";
import { trpc } from "../../utils/trpc";

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
    return <Error>{error.message}</Error>;
  }

  return (
    <Stack spacing={4}>
      <Heading>Redis Channels</Heading>
      <UnorderedList>
        {data?.map((channel) => (<ListItem>{channel}</ListItem>))}
      </UnorderedList>
    </Stack>
  );
}
