import React, { useEffect } from 'react'
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Pagination } from '../../../components/Pagination';
import { useQuery } from '@apollo/client';
import { Badge, Box, Flex, Heading, HStack, Table, Tbody, Td, Th, Thead, Tr, Text } from '@chakra-ui/react';
import { TdUser } from '../../../components/TdUser';
import { Loading } from '../../../components/Loading';
import { Error } from '../../../components/Error';
import { Indicator } from '../../../components/Indicator';
import { Status } from '../../../types/User';
import { beepStatusMap } from '.';
import { createRoute, useNavigate } from '@tanstack/react-router';
import { adminRoute } from '..';
import { graphql } from '../../../graphql';

dayjs.extend(duration);

export const ActiveBeepsGraphQL = graphql(`
  query getInProgressBeeps($show: Int, $offset: Int) {
    getInProgressBeeps (show: $show, offset: $offset) {
      items {
        id
        origin
        destination
        start
        groupSize
        status
        beeper {
          id
          name
          photo
          username
        }
        rider {
          id
          name
          photo
          username
        }
      }
      count
    }
  }
`);

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

  const { data, loading, error, refetch, startPolling, stopPolling } = useQuery(ActiveBeepsGraphQL, {
    variables: {
      offset: (page - 1) * pageLimit,
      show: pageLimit
    }
  });

  useEffect(() => {
    startPolling(2000);
    if (data) {
      refetch();
    }
    return () => {
      stopPolling();
    };
  }, []);

  const setCurrentPage = (page: number) => {
    navigate({ search: { page } });
  };

  if (error) {
    return <Error error={error} />;
  }

  const beeps = data?.getInProgressBeeps;

  return (
    <Box>
      <Flex align="center">
        <Heading>Beeps</Heading>
        <Badge ml={2} variant="solid" colorScheme="green">
          in progress
        </Badge>
      </Flex>
      <Pagination
        resultCount={beeps?.count}
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
            {beeps?.items.map((beep) => (
              <Tr key={beep.id}>
                <TdUser user={beep.beeper} />
                <TdUser user={beep.rider} />
                <Td>{beep.origin}</Td>
                <Td>{beep.destination}</Td>
                <Td>{beep.groupSize}</Td>
                <Td>{dayjs().to(beep.start)}</Td>
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
      {loading && <Loading />}
      <Pagination
        resultCount={beeps?.count}
        limit={pageLimit}
        currentPage={page}
        setCurrentPage={setCurrentPage}
      />
    </Box>
  );
}
