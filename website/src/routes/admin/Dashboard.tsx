import React from "react";
import { Box, Heading, Spinner, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { gql, useQuery } from "@apollo/client";
import { GetUsersPerDomainQuery } from "../../generated/graphql";
import { ResponsivePie } from '@nivo/pie'

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
    return <Spinner />;
  }

  return (
    <Box>
      <Heading>Dashboard</Heading>
      <Box height="400px">
        <ResponsivePie
          data={usersPerDomain?.map(({ domain, count }) => ({
            id: domain,
            label: domain,
            value: count
          }))}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          padAngle={0.7}
          activeOuterRadiusOffset={8}
          colors={{ scheme: 'nivo' }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#333333"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: 'color' }}
          arcLabelsSkipAngle={10}
          legends={[
            {
              anchor: 'bottom',
              direction: 'row',
              justify: false,
              translateX: 0,
              translateY: 56,
              itemsSpacing: 0,
              itemWidth: 100,
              itemHeight: 18,
              itemTextColor: '#999',
              itemDirection: 'left-to-right',
              itemOpacity: 1,
              symbolSize: 18,
              symbolShape: 'circle',
            }
          ]}
        />
      </Box>
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
