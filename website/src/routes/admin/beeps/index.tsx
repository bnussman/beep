import React from 'react'
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

const beepStatusMap: Record<Status, string> = {
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

  const { data, loading, error } = useQuery<GetBeepsQuery>(BeepsGraphQL, {
    variables: {
      offset: (page - 1) * pageLimit,
      show: pageLimit
    }
  });

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
              {/* <Th></Th> */}
            </Tr>
          </Thead>
          <Tbody>
            {data?.getBeeps && (data.getBeeps.items).map(entry => (
              <Tr key={entry.id}>
                <TdUser user={entry.beeper} />
                <TdUser user={entry.rider} />
                <Td>{entry.origin}</Td>
                <Td>{entry.destination}</Td>
                <Td>{entry.groupSize}</Td>
                <Td>
                  <HStack>
                    <Indicator color={beepStatusMap[entry.status as Status]} />
                    <Text textTransform="capitalize">{entry.status.replaceAll("_", " ")}</Text>
                  </HStack>
                </Td>
                <Td>{dayjs().to(entry.start)}</Td>
                <Td>{dayjs().to(entry.end)}</Td>
                <Td>{dayjs.duration(new Date(entry.end).getTime() - new Date(entry.start).getTime()).humanize()}</Td>
                {/* <Td>
                  <Link to={entry.id}>
                    <ExternalLinkIcon />
                  </Link>
                </Td> */}
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
