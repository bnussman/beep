import React from "react";
import { Heading, Stack, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { gql, useQuery } from "@apollo/client";
import { GetUsersPerDomainQuery } from "../../generated/graphql";
import { Loading } from "../../components/Loading";
import { Error } from "../../components/Error";

const UsersByDomainQuery = gql`
  query GetUsersPerDomain {
    getUsersPerDomain {
      domain
      count
    }
  }
`;

export function UsersByDomain() {
  const { data, loading, error } = useQuery<GetUsersPerDomainQuery>(UsersByDomainQuery);

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
