import React, { useEffect } from 'react'
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Pagination } from '../../../components/Pagination';
import { gql, useQuery } from '@apollo/client';
import { GetBeepsQuery } from '../../../generated/graphql';
import { Box, Heading, HStack, Table, Tbody, Td, Th, Thead, Tr, Text } from '@chakra-ui/react';
import { TdUser } from '../../../components/TdUser';
import { useSearchParams } from 'react-router-dom';
import { Loading } from '../../../components/Loading';
import { Error } from '../../../components/Error';
import { Indicator } from '../../../components/Indicator';
import { Status } from '../../../types/User';
import { useAutoAnimate } from '@formkit/auto-animate/react';

dayjs.extend(duration);

export const BeepsGraphQL = gql`
  query getBeeps($show: Int, $offset: Int) {
    getBeeps(show: $show, offset: $offset) {
      items {
        id
        origin
        destination
        start
        end
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

export const beepStatusMap: Record<Status, string> = {
  [Status.WAITING]: 'orange',
  [Status.ON_THE_WAY]: 'orange',
  [Status.ACCEPTED]: 'green',
  [Status.IN_PROGRESS]: 'green',
  [Status.HERE]: 'green',
  [Status.DENIED]: 'red',
  [Status.CANCELED]: 'red',
  [Status.COMPLETE]: 'green',
};

export function Beeps() {
  const pageLimit = 20;
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.has('page') ? Number(searchParams.get('page')) : 1;
  
  const [animationParent] = useAutoAnimate();

  const { data, loading, error, refetch, startPolling, stopPolling } = useQuery<GetBeepsQuery>(BeepsGraphQL, {
    variables: {
      offset: (page - 1) * pageLimit,
      show: pageLimit
    }
  });

  useEffect(() => {
    startPolling(3000);

    if (data) {
      refetch();
    }
    
    return () => {
      stopPolling();
    }
  }, []);

  const setCurrentPage = (page: number) => {
    setSearchParams({ page: String(page) });
  };

  if (error) {
    return <Error error={error} />;
  }

  return (
    <Box>
      <Heading>Beeps</Heading>
      <Pagination
        resultCount={data?.getBeeps.count}
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
          <Tbody ref={animationParent}>
            {data?.getBeeps.items.map((beep) => (
              <Tr key={beep.id}>
                <TdUser user={beep.beeper} />
                <TdUser user={beep.rider} />
                <Td>{beep.origin}</Td>
                <Td>{beep.destination}</Td>
                <Td>{beep.groupSize}</Td>
                <Td>
                  <HStack>
                    <Indicator color={beepStatusMap[beep.status as Status]} />
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
      {loading && <Loading />}
      <Pagination
        resultCount={data?.getBeeps.count}
        limit={pageLimit}
        currentPage={page}
        setCurrentPage={setCurrentPage}
      />
    </Box>
  );
}
