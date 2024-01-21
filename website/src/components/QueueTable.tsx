import React, { useEffect } from 'react'
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { TdUser } from './TdUser';
import { Indicator } from './Indicator';
import { Text, Box, Center, HStack, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { client } from '../utils/Apollo';
import { useQuery } from '@apollo/client';
import { GetUser, userRoute } from '../routes/admin/users/User';
import { Status } from '../types/User';
import { beepStatusMap } from '../routes/admin/beeps';
import { Route } from '@tanstack/react-router';
import { graphql } from 'gql.tada';

dayjs.extend(duration);

export const QueueSubscription = graphql(`
  subscription GetQueue($id: String!) {
    getBeeperUpdates(id: $id) {
      id
      origin
      destination
      start
      groupSize
      status
      rider {
        id
        photo
        username
        first
        last
        name
      }
    }
  }
`);

let sub: any;

export const queueRoute = new Route({
  component: QueueTable,
  path: 'queue',
  getParentRoute: () => userRoute,
});

export function QueueTable() {
  const { userId } = queueRoute.useParams();

  const { data } = useQuery(GetUser, { variables: { id: userId } });

  const user = data?.getUser;

  async function subscribe() {
    const a = client.subscribe({ query: QueueSubscription, variables: { id: userId } });

    sub = a.subscribe(({ data }) => {
      client.writeQuery({
        query: GetUser,
        data: {
          getUser: {
            ...user,
            queue: data?.getBeeperUpdates
          }
        },
        variables: {
          id: userId
        }
      });
    });
  }

  useEffect(() => {
    subscribe();

    return () => {
      sub?.unsubscribe();
    };
  }, []);


  if (!user?.queue || user.queue.length === 0) {
    return (
      <Center h="100px">
        This user's queue is empty.
      </Center>
    );
  }

  return (
    <Box overflowX="auto">
      <Table>
        <Thead>
          <Tr>
            <Th>Rider</Th>
            <Th>Origin</Th>
            <Th>Destination</Th>
            <Th>Group Size</Th>
            <Th>Start Time</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {user?.queue.map((beep) => (
            <Tr key={beep.id}>
              <TdUser user={beep.rider} />
              <Td>{beep.origin}</Td>
              <Td>{beep.destination}</Td>
              <Td>{beep.groupSize}</Td>
              <Td>{dayjs().to(beep.start as string)}</Td>
              <Td>
                <HStack>
                  <Indicator color={beepStatusMap[beep.status as Status]} />
                  <Text textTransform="capitalize">{beep.status.replaceAll("_", " ")}</Text>
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
