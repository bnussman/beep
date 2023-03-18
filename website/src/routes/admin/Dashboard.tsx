import React from "react";
import { Box, Center, Heading, Spinner, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { gql, useQuery } from "@apollo/client";
import { GetUsersPerDomainQuery } from "../../generated/graphql";

const UsersByDomainQuery = gql`
  query GetUsersPerDomain {
    getUsersPerDomain {
      domain
      count
    }
  }
`;

export function Dashboard() {
  const { data, loading } = useQuery<GetUsersPerDomainQuery>(UsersByDomainQuery);

  const usersPerDomain = data?.getUsersPerDomain ?? [];

  if (loading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  return (
    <Box>
      <Heading>Dashboard</Heading>
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
  );
}
