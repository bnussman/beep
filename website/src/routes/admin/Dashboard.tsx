import React from "react";
import { Badge, Box, Center, Heading, HStack, Spinner, Table, Tbody, Td, Th, Thead, Tr, useColorMode, Text } from "@chakra-ui/react";
import { gql, useQuery } from "@apollo/client";
import { GetUsersPerDomainQuery } from "../../generated/graphql";
import { Pie, PieChart, ResponsiveContainer } from "recharts";

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
  const { colorMode } = useColorMode();

  const usersPerDomain = data?.getUsersPerDomain ?? [];

  const fontColor = colorMode === "dark" ? "white" : "black";

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
      <ResponsiveContainer width="100%" height={600}>
        <PieChart width={400} height={600}>
          <Pie
            dataKey="value"
            data={usersPerDomain.map((item, index) => ({ name: item.domain, value: item.count, fill: '#'+(Math.random()*0xFFFFFF<<0).toString(16) }))}
            label={(data) => `${data.name} (${data.value})`}
            fill="#8884d8"
            // color={colorMode === 'dark' ? 'white' : undefined}
          />
        </PieChart>
      </ResponsiveContainer>
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
