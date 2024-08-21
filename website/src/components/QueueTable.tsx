import React from 'react'
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { TdUser } from './TdUser';
import { Indicator } from './Indicator';
import { Text, Box, Center, HStack, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { userRoute } from '../routes/admin/users/User';
import { beepStatusMap } from '../routes/admin/beeps';
import { createRoute } from '@tanstack/react-router';
import { trpc } from '../utils/trpc';

dayjs.extend(duration);

export const queueRoute = createRoute({
  component: QueueTable,
  path: 'queue',
  getParentRoute: () => userRoute,
});

export function QueueTable() {
  const { userId } = queueRoute.useParams();

  const { data } = trpc.beep.beeps.useQuery({
    userId,
    offset: 0,
    show: 500,
  });

  // @todo subscribe to users queue

  if (data?.count === 0) {
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
          {data?.beeps.map((beep) => (
            <Tr key={beep.id}>
              <TdUser user={beep.rider} />
              <Td>{beep.origin}</Td>
              <Td>{beep.destination}</Td>
              <Td>{beep.groupSize}</Td>
              <Td>{dayjs().to(beep.start)}</Td>
              <Td>
                <HStack>
                  <Indicator color={beepStatusMap[beep.status]} />
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
