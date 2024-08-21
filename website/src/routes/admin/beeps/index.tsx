import React from 'react'
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Pagination } from '../../../components/Pagination';
import { Box, Heading, HStack, Table, Tbody, Td, Th, Thead, Tr, Text } from '@chakra-ui/react';
import { TdUser } from '../../../components/TdUser';
import { Loading } from '../../../components/Loading';
import { Error } from '../../../components/Error';
import { Indicator } from '../../../components/Indicator';
import { createRoute, useNavigate } from '@tanstack/react-router';
import { adminRoute } from '..';
import { RouterOutput, trpc } from '../../../utils/trpc';

dayjs.extend(duration);

export const beepStatusMap: Record<RouterOutput['beep']['beep']['status'], string> = {
  waiting: 'orange',
  on_the_way: 'orange',
  accepted: 'green',
  in_progress: 'green',
  here: 'green',
  denied: 'red',
  canceled: 'red',
  complete: 'green',
};

export const beepsRoute = createRoute({
  path: "beeps",
  getParentRoute: () => adminRoute,
});

export const beepsListRoute = createRoute({
  path: "/",
  getParentRoute: () => beepsRoute,
  component: Beeps,
  validateSearch: (search: Record<string, string>) => {
    return {
      page: Number(search?.page ?? 1),
    }
  },
});

export function Beeps() {
  const pageLimit = 20;
  const { page } = beepsListRoute.useSearch();
  const navigate = useNavigate({ from: beepsListRoute.id });

  const { data, isLoading, error } = trpc.beep.beeps.useQuery(
    {
      offset: (page - 1) * pageLimit,
      show: pageLimit
    },
    {
      refetchInterval: 5_000,
      refetchOnMount: true,
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
      <Heading>Beeps</Heading>
      <Pagination
        resultCount={data?.count ?? 0}
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
              <Th>Group</Th>
              <Th>Status</Th>
              <Th>Start</Th>
              <Th>End</Th>
              <Th>Duration</Th>
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
                <Td>
                  <HStack>
                    <Indicator color={beepStatusMap[beep.status]} />
                    <Text textTransform="capitalize">{beep.status.replaceAll("_", " ")}</Text>
                  </HStack>
                </Td>
                <Td>{dayjs().to(beep.start)}</Td>
                <Td>{beep.end ? dayjs().to(beep.end) : "N/A"}</Td>
                <Td>{beep.end ? dayjs.duration(new Date(beep.end).getTime() - new Date(beep.start).getTime()).humanize() : "N/A"}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      {isLoading && <Loading />}
      <Pagination
        resultCount={data?.count ?? 0}
        limit={pageLimit}
        currentPage={page}
        setCurrentPage={setCurrentPage}
      />
    </Box>
  );
}
