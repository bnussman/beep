import React, { useEffect } from 'react'
import { gql, useQuery, useSubscription } from '@apollo/client';
import { Badge, Box, Heading, HStack, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { TdUser } from '../../../components/TdUser';
import { Loading } from '../../../components/Loading';
import { Error } from '../../../components/Error';
import { BeepersMap } from './BeepersMap';
import { cache } from '../../../utils/Apollo';
import { Route } from '@tanstack/react-router';
import { adminRoute } from '..';
import { graphql } from 'gql.tada';

export const BeepersGraphQL = graphql(`
  query GetBeepers($latitude: Float!, $longitude: Float!, $radius: Float) {
    getBeepers(latitude: $latitude, longitude: $longitude, radius: $radius) {
      id
      username
      name
      photo
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
`);

const BeeperLocationUpdates = gql`
  subscription GetBeeperLocationUpdates(
    $radius: Float!
    $longitude: Float!
    $latitude: Float!
    $anonymize: Boolean
  ) {
    getBeeperLocationUpdates(
      radius: $radius
      longitude: $longitude
      latitude: $latitude
      anonymize: $anonymize
    ) {
      id
      latitude
      longitude
    }
  }
`;

export const beepersRoute = new Route({
  component: Beepers,
  path: 'beepers',
  getParentRoute: () => adminRoute,
});

export function Beepers() {
  const {
    data,
    loading,
    error,
    startPolling,
    stopPolling
  } = useQuery(BeepersGraphQL, {
    variables: {
      latitude: 0,
      longitude: 0,
      radius: 0
    }
  });

  const beepers = data?.getBeepers;

  useEffect(() => {
    startPolling(15000);
    return () => {
      stopPolling();
    };
  }, []);

  useSubscription(BeeperLocationUpdates, {
    variables: {
      radius: 0,
      latitude: 0,
      longitude: 0,
      anonymize: false,
    },
    onData(data) {
      const location = data.data.data?.getBeeperLocationUpdates;
      if (
        location &&
        location.latitude !== null &&
        location.latitude !== undefined &&
        location.longitude !== null &&
        location.longitude !== undefined
      ) {
        cache.modify({
          id: cache.identify({
            __typename: "User",
            id: location.id,
          }),
          fields: {
            location() {
              return {
                latitude: location.latitude,
                longitude: location.longitude,
              };
            },
          },
        });
      }
    },
  });


  if (loading || beepers === undefined) {
    return <Loading />;
  }

  if (error) {
    return <Error error={error} />;
  }

  return (
    <Box>
      <HStack alignItems="center">
        <Heading>Beepers</Heading>
        <Badge ml={2}>
          {String(beepers?.length ?? 0)}
        </Badge>
      </HStack>
      <BeepersMap beepers={beepers} />
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
            {beepers.map((beeper) => (
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
