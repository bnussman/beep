import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Pagination } from '../../../components/Pagination';
import { gql, useQuery } from '@apollo/client';
import { Badge, Box, Flex, Heading, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { TdUser } from '../../../components/TdUser';
import { Loading } from '../../../components/Loading';
import { Error } from '../../../components/Error';
import { GetInProgressBeepsQuery } from '../../../generated/graphql';
import { Indicator } from '../../../components/Indicator';
import { getStatus } from '../../../components/QueueTable';
import { Status } from '../../../types/User';

dayjs.extend(duration);

export const ActiveBeepsGraphQL = gql`
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
`;

export function ActiveBeeps() {
  const pageLimit = 25;
  const { data, loading, error, refetch, startPolling, stopPolling } = useQuery<GetInProgressBeepsQuery>(ActiveBeepsGraphQL, { variables: { offset: 0, show: pageLimit } });
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    startPolling(4000);
    return () => {
      stopPolling();
    };
  }, []);

  async function fetchBeeps(page: number) {
    refetch({
      offset: page,
      show: pageLimit
    })
  }

  if (error) return <Error error={error} />;

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
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onPageChange={fetchBeeps}
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
              <Th>Is Accepted</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {beeps && beeps?.items?.map(entry => (
              <Tr key={entry.id}>
                <TdUser user={entry.beeper} />
                <TdUser user={entry.rider} />
                <Td>{entry.origin}</Td>
                <Td>{entry.destination}</Td>
                <Td>{entry.groupSize}</Td>
                <Td>{dayjs().to(entry.start)}</Td>
                <Td>{entry.status !== Status.WAITING ? <Indicator color='green' /> : <Indicator color='red' />}</Td>
                <Td>{entry.status.replaceAll("_", " ")}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      {loading && <Loading />}
      <Pagination
        resultCount={beeps?.count}
        limit={pageLimit}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onPageChange={fetchBeeps}
      />
    </Box>
  );
}
