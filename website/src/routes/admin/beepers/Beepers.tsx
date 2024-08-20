import React from 'react'
import { Badge, Box, Heading, HStack, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { TdUser } from '../../../components/TdUser';
import { Loading } from '../../../components/Loading';
import { Error } from '../../../components/Error';
import { BeepersMap } from './BeepersMap';
import { createRoute } from '@tanstack/react-router';
import { adminRoute } from '..';
import { trpc } from '../../../utils/trpc';

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

  // @todo subscribe to all beeper's locations

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
