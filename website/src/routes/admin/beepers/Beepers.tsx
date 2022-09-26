import React, { useEffect } from 'react'
import { gql, useQuery, useSubscription } from '@apollo/client';
import { GetBeeperLocationUpdatesSubscription, GetBeepersQuery } from '../../../generated/graphql';
import { Badge, Box, Center, Flex, Heading, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { TdUser } from '../../../components/TdUser';
import { Loading } from '../../../components/Loading';
import { Error } from '../../../components/Error';
import { BeepersMap } from './BeepersMap';
import { cache } from '../../../utils/Apollo';

const BeepersGraphQL = gql`
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
`;

const BeeperLocationUpdates = gql`
  subscription GetBeeperLocationUpdates(
    $radius: Float!
    $longitude: Float!
    $latitude: Float!
  ) {
    getBeeperLocationUpdates(
      radius: $radius
      longitude: $longitude
      latitude: $latitude
    ) {
      id
      latitude
      longitude
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
  } = useQuery<GetBeepersQuery>(BeepersGraphQL, {
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

  useSubscription<GetBeeperLocationUpdatesSubscription>(BeeperLocationUpdates, {
    variables: {
      radius: 0,
      latitude: 0,
      longitude: 0,
    },
    onSubscriptionData({ subscriptionData }) {
      const data = subscriptionData.data?.getBeeperLocationUpdates;
      if (
        data &&
        data.latitude !== null &&
        data.latitude !== undefined &&
        data.longitude !== null &&
        data.longitude !== undefined
      ) {
        cache.modify({
          id: cache.identify({
            __typename: "AnonymousBeeper",
            id: data.id,
          }),
          fields: {
            latitude() {
              return data.latitude;
            },
            longitude() {
              return data.longitude;
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

  if (beepers?.length === 0) {
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
          {String(beepers?.length ?? 0)}
        </Badge>
      </Flex>
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