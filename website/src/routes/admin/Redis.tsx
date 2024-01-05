import React from "react";
import { Heading, ListItem, Stack, UnorderedList } from "@chakra-ui/react";
import { gql, useQuery } from "@apollo/client";
import { RedisChannelsQueryQuery } from "../../generated/graphql";
import { Loading } from "../../components/Loading";
import { Error } from "../../components/Error";
import { Route } from "@tanstack/react-router";
import { adminRoute } from ".";

const RedisChannelsQuery = gql`
  query RedisChannelsQuery {
    getRedisChannels
  }
`;

export const redisRoute = new Route({
  component: Redis,
  path: "redis",
  getParentRoute: () => adminRoute,
});

export function Redis() {
  const { data, loading, error } = useQuery<RedisChannelsQueryQuery>(RedisChannelsQuery);


  if (loading) {
    return <Loading />;
  }

  if (error ) {
    return <Error error={error} />
  }

  return (
    <Stack spacing={4}>
      <Heading>Redis Channels</Heading>
      <UnorderedList>
        {data?.getRedisChannels.map((channel) => (<ListItem>{channel}</ListItem>))}
      </UnorderedList>
    </Stack>
  );
}
