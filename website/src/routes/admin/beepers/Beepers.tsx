import React, { useEffect } from 'react'
import { gql, useQuery, useSubscription } from '@apollo/client';
import { Badge, Box, Heading, HStack, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { TdUser } from '../../../components/TdUser';
import { Loading } from '../../../components/Loading';
import { Error } from '../../../components/Error';
import { BeepersMap } from './BeepersMap';
import { cache } from '../../../utils/apollo';
import { createRoute } from '@tanstack/react-router';
import { adminRoute } from '..';
import { graphql } from 'gql.tada';
import { trpc } from '../../../utils/trpc';

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

export const beepersRoute = createRoute({
  component: Beepers,
  path: 'beepers',
  getParentRoute: () => adminRoute,
});

export function Beepers() {
  const { data, isLoading, error } = trpc.user.users.useQuery({
    isBeeping: true,
    show: 500,
    offset: 0,
  });

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


  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error>{error.message}</Error>;
  }

  return (
    <Box>
      <HStack alignItems="center">
        <Heading>Beepers</Heading>
        <Badge ml={2}>
          {data?.count ?? 0}
        </Badge>
      </HStack>
      <BeepersMap beepers={data?.users ?? []} />
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
            {data?.users.map((beeper) => (
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
