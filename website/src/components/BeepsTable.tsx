import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { GetBeepsQuery } from '../generated/graphql';
import { Pagination } from './Pagination';
import { Box, Center, HStack, Table, Tbody, Td, Th, Thead, Tr, Text } from '@chakra-ui/react';
import { TdUser } from './TdUser';
import { Loading } from './Loading';
import { Indicator } from './Indicator';
import { Status } from '../types/User';
import { beepStatusMap } from '../routes/admin/beeps';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);

interface Props {
  userId: string;
}

const Hisory = gql`
  query GetBeepsForUser($id: String, $show: Int, $offset: Int) {
    getBeeps(id: $id, show: $show, offset: $offset) {
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
          photo
          username
          first
          last
          name
        }
        rider {
          id
          photo
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

export function BeepsTable(props: Props) {
  const pageLimit = 5;

  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data, loading } = useQuery<GetBeepsQuery>(
    Hisory,
    {
      variables: {
        id: props.userId,
        offset: (currentPage - 1) * pageLimit,
        show: pageLimit
      }
    }
  );

  if (data?.getBeeps && data.getBeeps.items.length === 0) {
    return (
      <Center h="100px">
        This user has no ride history.
      </Center>
    );
  }

  return (
    <Box>
      <Pagination
        resultCount={data?.getBeeps.count}
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
            {data?.getBeeps.items.map((ride) => (
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
                <Td>{dayjs.duration(new Date(ride.end).getTime() - new Date(ride.start).getTime()).humanize()}</Td>
                <Td>{dayjs().to(ride.end)}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <Pagination
        resultCount={data?.getBeeps.count}
        limit={pageLimit}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </Box>
  );
}
