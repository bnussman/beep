import React, { useEffect } from 'react'
import { gql, useQuery } from '@apollo/client';
import { GetBeeperListQuery, User } from '../../../generated/graphql';
import { Box, Heading, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import TdUser from '../../../components/TdUser';
import Loading from '../../../components/Loading';
import { Error } from '../../../components/Error';
import BeepersMap from './BeepersMap';

const BeepersGraphQL = gql`
  query GetBeeperList($latitude: Float!, $longitude: Float!, $radius: Float) {
    getBeeperList(input: {
        latitude: $latitude,
        longitude: $longitude,
        radius: $radius
    }) {
      id
      username
      name
      photoUrl
      singlesRate
      groupRate
      capacity
      isStudent
      queueSize
      masksRequired
      location {
        longitude
        latitude
      }
    }
  }
`;

function Beepers() {
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
    startPolling(4000);
    return () => {
      stopPolling();
    };
  }, []);

  if (error) return <Error error={error} />;

  return (
    <Box>
      <Heading>Beepers</Heading>
      <BeepersMap beepers={data?.getBeeperList as User[]} />
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
      {loading && <Loading />}
    </Box>
  );
}

export default Beepers;
