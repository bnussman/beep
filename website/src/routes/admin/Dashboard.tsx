import React from "react";
import { Box, Center, Heading, ListItem, Spinner, Stack, Table, Tbody, Td, Th, Thead, Tr, UnorderedList } from "@chakra-ui/react";
import { gql, useQuery } from "@apollo/client";
import { GetUsersPerDomainQuery, RedisChannelsQueryQuery } from "../../generated/graphql";

const UsersByDomainQuery = gql`
  query GetUsersPerDomain {
    getUsersPerDomain {
      domain
      count
    }
  }
`;

const RedisChannelsQuery = gql`
  query RedisChannelsQuery {
    getRedisChannels  
  }
`;

export function Dashboard() {
  const { data, loading } = useQuery<GetUsersPerDomainQuery>(UsersByDomainQuery);
  const { data: redisChannels, loading: redisLoading } = useQuery<RedisChannelsQueryQuery>(RedisChannelsQuery);

  const usersPerDomain = data?.getUsersPerDomain ?? [];

  if (loading || redisLoading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  return (
    <Stack spacing={4}>
      <Heading>Dashboard</Heading>
      <Box>
        <Heading size="md">Redis Channels</Heading>
        <UnorderedList>
          {redisChannels?.getRedisChannels.map((channel) => (<ListItem>{channel}</ListItem>))}
        </UnorderedList>
      </Box>
      <Box>
        <Heading size="md">Domains</Heading>
        <Table>
          <Thead>
            <Tr>
              <Th>Domain</Th>
              <Th>Count</Th>
            </Tr>
          </Thead>
          <Tbody>
            {usersPerDomain?.map(({ domain, count }) => (
              <Tr key={domain}>
                <Td>{domain}</Td>
                <Td>{count}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Stack>
  );
}
