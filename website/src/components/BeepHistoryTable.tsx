import React from 'react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Card } from './Card';
import { gql, useQuery } from '@apollo/client';
import { GetBeeperHistoryQuery } from '../generated/graphql';
import { useState } from 'react';
import Pagination from './Pagination';
import { Box, Center, Spinner, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import TdUser from './TdUser';

dayjs.extend(duration);

interface Props {
  userId: string;
}

const Hisory = gql`
    query GetBeeperHistory($show: Int, $offset: Int, $id: String!) {
        getBeepHistory(show: $show, offset: $offset, id: $id) {
            items {
                id
                origin
                destination
                start
                end
                groupSize
                rider {
                    id
                    photoUrl
                    username
                    first
                    last
                    name
                }
            }
            count
        }
    }
`;

function BeepHistoryTable(props: Props) {
  const pageLimit = 5;
  const { data, loading, refetch } = useQuery<GetBeeperHistoryQuery>(Hisory, { variables: { id: props.userId, offset: 0, show: pageLimit } });
  const [currentPage, setCurrentPage] = useState<number>(1);

  async function fetchHistory(page: number) {
    refetch({
      id: props.userId,
      offset: page,
    })
  }
  if (data?.getBeepHistory && data.getBeepHistory.items.length === 0) {
    return (
      <Center h="100px">
        This user's queue is empty.
      </Center>
    );
  }

  if (loading) {
    return (
      <Center h="100px">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box>
      <Pagination
        resultCount={data?.getBeepHistory?.count}
        limit={pageLimit}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onPageChange={fetchHistory}
      />
      <Card>
        <Table>
          <Thead>
            <Tr>
              <Th>Rider</Th>
              <Th>Origin</Th>
              <Th>Destination</Th>
              <Th>Group Size</Th>
              <Th>Start Time</Th>
              <Th>End Time</Th>
              <Th>Duration</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.getBeepHistory && (data.getBeepHistory.items).map(beep => {
              return (
                <Tr key={beep.id}>
                  <TdUser user={beep.rider} />
                  <Td>{beep.origin}</Td>
                  <Td>{beep.destination}</Td>
                  <Td>{beep.groupSize}</Td>
                  <Td>{dayjs().to(beep.start)}</Td>
                  <Td>{dayjs().to(beep.end)}</Td>
                  <Td>{dayjs.duration(new Date(beep.end).getTime() - new Date(beep.start).getTime()).humanize()}</Td>
                </Tr>
              )
            })}
          </Tbody>
        </Table>
      </Card>
      <Pagination
        resultCount={data?.getBeepHistory?.count}
        limit={pageLimit}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onPageChange={fetchHistory}
      />
    </Box>
  );
}

export default BeepHistoryTable;
