import React from "react";
import { Heading, ListItem, Stack, UnorderedList } from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import { Loading } from "../../components/Loading";
import { Error } from "../../components/Error";
import { createRoute } from "@tanstack/react-router";
import { adminRoute } from ".";
import { graphql } from "gql.tada";
import { trpc } from "../../utils/trpc";

export const redisRoute = createRoute({
  component: Redis,
  path: "redis",
  getParentRoute: () => adminRoute,
});

export function Redis() {
  const { data, isLoading, error } = trpc.redis.channels.useQuery();

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
