import React from "react";
import { Box, Center, Heading, Spinner, Table, Tbody, Td, Th, Thead, Tr, useColorMode } from "@chakra-ui/react";
import { gql, useQuery } from "@apollo/client";
import { GetUsersPerDomainQuery } from "../../generated/graphql";
import Chart from "react-google-charts";

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
      <Chart
        chartType="PieChart"
        data={[["School", "Count"], ...usersPerDomain.map(({ domain, count }) => ([domain, count]))]}
        options={{
          backgroundColor: "transparent",
          legend: { textStyle: { color: fontColor } }
        }}
        width={"100%"}
        height={"600px"}
      />
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
