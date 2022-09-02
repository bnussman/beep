import React, { useEffect } from 'react'
import { gql, useQuery } from '@apollo/client';
import { GetBeeperListQuery, User } from '../../../generated/graphql';
import { Badge, Box, Center, Flex, Heading, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { TdUser } from '../../../components/TdUser';
import { Loading } from '../../../components/Loading';
import { Error } from '../../../components/Error';
import { BeepersMap } from './BeepersMap';

const BeepersGraphQL = gql`
  query GetBeeperList($latitude: Float!, $longitude: Float!, $radius: Float) {
    getBeeperList(
      input: {
        latitude: $latitude,
        longitude: $longitude,
        radius: $radius
      }
    ) {
      id
      username
      name
      picture
      singlesRate
      groupRate
      capacity
      isStudent
      queueSize
      location {
        longitude
        latitude
      }
    }
  }
`;

export function Beepers() {
  const {
    data,
    loading,
    error,
    startPolling,
    stopPolling
  } = useQuery<GetBeeperListQuery>(BeepersGraphQL, {
    variables: {
      latitude: 0,
      longitude: 0,
      radius: 0
    }
  });

  useEffect(() => {
    startPolling(1500);
    return () => {
      stopPolling();
    };
  }, []);

  if (error) return <Error error={error} />;
  if (loading) return <Loading />;

  if (data?.getBeeperList.length === 0) {
    return (
      <Box>
        <Heading>Beepers</Heading>
        <Center>
          <Heading size="lg" mt={4}>
            Nobody is beeping right now
          </Heading>
        </Center>
      </Box>
    );
  }

  return (
    <Box>
      <Flex align="center">
        <Heading>Beepers</Heading>
        <Badge ml={2}>
          {String(data?.getBeeperList.length || 0)}
        </Badge>
      </Flex>
      <BeepersMap beepers={data?.getBeeperList as User[]} />
      <Box overflowX="auto">
        <Table>
          <Thead>
            <Tr>
              <Th>Beeper</Th>
              <Th>Queue size</Th>
              <Th>Ride capacity</Th>
              <Th>Rate</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.getBeeperList && (data.getBeeperList).map(beeper => (
              <Tr key={beeper.id}>
                <TdUser user={beeper} />
                <Td>{beeper.queueSize} riders</Td>
                <Td>{beeper.capacity} riders</Td>
                <Td>${beeper.singlesRate} / ${beeper.groupRate}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}