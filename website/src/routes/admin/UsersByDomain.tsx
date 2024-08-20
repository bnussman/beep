import React from "react";
import { Heading, Stack, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { Loading } from "../../components/Loading";
import { Error } from "../../components/Error";
import { createRoute } from "@tanstack/react-router";
import { usersRoute } from "./users";
import { trpc } from "../../utils/trpc";

export const usersByDomainRoute = createRoute({
  component: UsersByDomain,
  path: 'domain',
  getParentRoute: () => usersRoute,
});

export function UsersByDomain() {
  const { data, isLoading, error } = trpc.user.usersByDomain.useQuery();

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error>{error.message}</Error>;
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
          {data?.map(({ domain, count }) => (
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
