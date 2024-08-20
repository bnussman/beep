import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Pagination } from './Pagination';
import { Box, Center, HStack, Table, Tbody, Td, Th, Thead, Tr, Text } from '@chakra-ui/react';
import { TdUser } from './TdUser';
import { Indicator } from './Indicator';
import { Status } from '../types/User';
import { beepStatusMap } from '../routes/admin/beeps';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import { createRoute } from '@tanstack/react-router';
import { userRoute } from '../routes/admin/users/User';
import { graphql } from '../graphql';
import { trpc } from '../utils/trpc';

dayjs.extend(duration);
dayjs.extend(relativeTime);

export const beepsTableRoute = createRoute({
  component: BeepsTable,
  path: 'beeps',
  getParentRoute: () => userRoute,
});

export function BeepsTable() {
  const pageLimit = 5;

  const [currentPage, setCurrentPage] = useState<number>(1);

  const { userId } = beepsTableRoute.useParams();

  const { data } = trpc.beep.beeps.useQuery({
    userId,
    offset: (currentPage - 1) * pageLimit,
    show: pageLimit
  });

  if (data?.count === 0) {
    return (
      <Center h="100px">
        This user has no ride history.
      </Center>
    );
  }

  return (
    <Box>
      <Pagination
        resultCount={data?.count}
        limit={pageLimit}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <Box overflowX="auto">
        <Table>
          <Thead>
            <Tr>
              <Th>Beeper</Th>
              <Th>Rider</Th>
              <Th>Origin</Th>
              <Th>Destination</Th>
              <Th>Group Size</Th>
              <Th>Status</Th>
              <Th>Duration</Th>
              <Th>When</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.beeps.map((ride) => (
              <Tr key={ride.id}>
                <TdUser user={ride.beeper} />
                <TdUser user={ride.rider} />
                <Td>{ride.origin}</Td>
                <Td>{ride.destination}</Td>
                <Td>{ride.groupSize}</Td>
                <Td>
                  <HStack>
                    <Indicator color={beepStatusMap[ride.status as Status]} />
                    <Text textTransform="capitalize">{ride.status.replaceAll("_", " ")}</Text>
                  </HStack>
                </Td>
                <Td>{ride.end ? dayjs.duration(new Date(ride.end).getTime() - new Date(ride.start).getTime()).humanize() : "Still in progress"}</Td>
                <Td>{dayjs().to(ride.end)}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <Pagination
        resultCount={data?.count}
        limit={pageLimit}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </Box>
  );
}
