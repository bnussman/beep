import React from 'react'
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { TdUser } from './TdUser';
import { Indicator } from './Indicator';
import { Text, Box, Center, HStack, Table, Tbody, Td, Th, Thead, Tr, Spinner } from '@chakra-ui/react';
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

  const utils = trpc.useUtils();

  const { data, isLoading, error } = trpc.beeper.queue.useQuery(userId);

  trpc.beeper.watchQueue.useSubscription(userId, {
    onData(queue) {
      utils.beeper.queue.setData(userId, queue);
    }
  });

  if (isLoading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  if (error) {
    return (
      <Center>
        {error.message}
      </Center>
    );
  }

  if (data?.length === 0) {
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
          {data?.map((beep) => (
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
