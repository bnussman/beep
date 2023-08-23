import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Pagination } from '../../../components/Pagination';
import { gql, useQuery } from '@apollo/client';
import { Badge, Box, Flex, Heading, HStack, Table, Tbody, Td, Th, Thead, Tr, Text } from '@chakra-ui/react';
import { TdUser } from '../../../components/TdUser';
import { Loading } from '../../../components/Loading';
import { Error } from '../../../components/Error';
import { GetInProgressBeepsQuery } from '../../../generated/graphql';
import { Indicator } from '../../../components/Indicator';
import { Status } from '../../../types/User';
import { beepStatusMap } from '.';
import { useSearchParams } from 'react-router-dom';
import { useAutoAnimate } from '@formkit/auto-animate/react';

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
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.has('page') ? Number(searchParams.get('page')) : 1;
  const { data, loading, error, refetch, startPolling, stopPolling } = useQuery<GetInProgressBeepsQuery>(ActiveBeepsGraphQL, {
    variables: {
      offset: (page - 1) * pageLimit,
      show: pageLimit
    }
  });

  const [animationParent] = useAutoAnimate();

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
    setSearchParams({ page: String(page) });
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
          <Tbody ref={animationParent}>
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
