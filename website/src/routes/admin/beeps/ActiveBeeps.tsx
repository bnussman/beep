import React from 'react'
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Pagination } from '../../../components/Pagination';
import { Badge, Box, Flex, Heading, HStack, Table, Tbody, Td, Th, Thead, Tr, Text } from '@chakra-ui/react';
import { TdUser } from '../../../components/TdUser';
import { Loading } from '../../../components/Loading';
import { Error } from '../../../components/Error';
import { Indicator } from '../../../components/Indicator';
import { beepStatusMap } from '.';
import { createRoute, useNavigate } from '@tanstack/react-router';
import { adminRoute } from '..';
import { trpc } from '../../../utils/trpc';

dayjs.extend(duration);

export const activeBeepsRoute = createRoute({
  component: ActiveBeeps,
  path: 'beeps/active',
  getParentRoute: () => adminRoute,
  validateSearch: (search: Record<string, string>)  => {
    return {
      page: Number(search?.page ?? 1),
    }
  },
});

export function ActiveBeeps() {
  const pageLimit = 25;
  const { page } = activeBeepsRoute.useSearch();
  const navigate = useNavigate({ from: activeBeepsRoute.id });

  const { data, isLoading, error } = trpc.beep.beeps.useQuery(
    {
      offset: (page - 1) * pageLimit,
      show: pageLimit,
      inProgress: true,
    },
    {
      refetchOnMount: true,
      refetchInterval: 5_000,
    }
  );

  const setCurrentPage = (page: number) => {
    navigate({ search: { page } });
  };

  if (error) {
    return <Error>{error.message}</Error>;
  }

  return (
    <Box>
      <Flex align="center">
        <Heading>Beeps</Heading>
        <Badge ml={2} variant="solid" colorScheme="green">
          in progress
        </Badge>
      </Flex>
      <Pagination
        resultCount={data?.count}
        limit={pageLimit}
        currentPage={page}
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
              <Th>Start Time</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.beeps.map((beep) => (
              <Tr key={beep.id}>
                <TdUser user={beep.beeper} />
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
      {isLoading && <Loading />}
      <Pagination
        resultCount={data?.count}
        limit={pageLimit}
        currentPage={page}
        setCurrentPage={setCurrentPage}
      />
    </Box>
  );
}
