import React from 'react'
import { Badge, Box, Heading, HStack, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { TdUser } from '../../../components/TdUser';
import { Loading } from '../../../components/Loading';
import { Error } from '../../../components/Error';
import { BeepersMap } from './BeepersMap';
import { createRoute } from '@tanstack/react-router';
import { adminRoute } from '..';
import { queryClient, trpc } from '../../../utils/trpc';
import { getQueryKey } from '@trpc/react-query';

export const beepersRoute = createRoute({
  component: Beepers,
  path: 'beepers',
  getParentRoute: () => adminRoute,
});

const queryKey = getQueryKey(trpc.user.users);

export function Beepers() {
  const utils = trpc.useUtils();

  const input = {
    isBeeping: true,
    show: 500,
    offset: 0,
  };

  const { data, isLoading, error } = trpc.user.users.useQuery(input);

  trpc.rider.beepersLocations.useSubscription(
    {
      longitude: 0,
      latitude: 0,
      admin: true,
    },
    {
      enabled: location !== undefined,
      onData(locationUpdate) {
        utils.user.users.setData(input, (oldUsers) => {
          if (!oldUsers)  {
            return undefined;
          }

          const indexOfUser = oldUsers.users.findIndex((user) => user.id === locationUpdate.id);

          if (indexOfUser !== -1) {
            const newData = [...oldUsers.users];

            newData[indexOfUser] = { ...oldUsers.users[indexOfUser], location: locationUpdate.location }

            return { ...oldUsers, users: newData };
          }
        })
      }
    }
  );

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
