import React from "react";
import { Heading, Stack, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import { Loading } from "../../components/Loading";
import { Error } from "../../components/Error";
import { createRoute } from "@tanstack/react-router";
import { usersRoute } from "./users";
import { graphql } from "gql.tada";

const UsersByDomainQuery = graphql(`
  query GetUsersPerDomain {
    getUsersPerDomain {
      domain
      count
    }
  }
`);

export const usersByDomainRoute = createRoute({
  component: UsersByDomain,
  path: 'domain',
  getParentRoute: () => usersRoute,
});

export function UsersByDomain() {
  const { data, loading, error } = useQuery(UsersByDomainQuery);

  const usersPerDomain = data?.getUsersPerDomain ?? [];

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error error={error} />
  }

  return (
    <Stack spacing={4}>
      <Heading>Users by Domain</Heading>
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
    </Stack>
  );
}
