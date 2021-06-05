import React, { useState } from 'react'
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Card } from '../../../components/Card';
import Pagination from '../../../components/Pagination';
import { gql, useQuery } from '@apollo/client';
import { GetBeepsQuery } from '../../../generated/graphql';
import { Box, Center, Heading, Spinner, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import TdUser from '../../../components/TdUser';
import { Link } from 'react-router-dom';
import { ExternalLinkIcon } from '@chakra-ui/icons';

dayjs.extend(duration);

const BeepsGraphQL = gql`
    query getBeeps($show: Int, $offset: Int) {
        getBeeps(show: $show, offset: $offset) {
            items {
                id
                origin
                destination
                start
                end
                groupSize
                beeper {
                    id
                    name
                    photoUrl
                    username
                }
                rider {
                    id
                    name
                    photoUrl
                    username
                }
            }
            count
        }
    }
`;
function Beeps() {
  const pageLimit = 5;
  const { data, loading, refetch } = useQuery<GetBeepsQuery>(BeepsGraphQL, { variables: { offset: 0, show: pageLimit } });
  const [currentPage, setCurrentPage] = useState<number>(1);

  async function fetchBeeps(page: number) {
    refetch({
      offset: page,
      show: pageLimit
    })
  }

  return (
    <Box>
      <Heading>Beeps</Heading>

      <Pagination
        resultCount={data?.getBeeps.count}
        limit={pageLimit}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onPageChange={fetchBeeps}
      />
      <Card>
        <Table>
          <Thead>
            <Tr>
            <Th>Beeper</Th>
            <Th>Rider</Th>
            <Th>Origin</Th>
            <Th>Destination</Th>
            <Th>Group Size</Th>
            <Th>Start Time</Th>
            <Th>End Time</Th>
            <Th>Duration</Th>
            <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.getBeeps && (data.getBeeps.items).map(entry => {
              return (
                <Tr key={entry.id}>
                  <TdUser user={entry.beeper} />
                  <TdUser user={entry.rider} />
                  <Td>{entry.origin}</Td>
                  <Td>{entry.destination}</Td>
                  <Td>{entry.groupSize}</Td>
                  <Td>{dayjs().to(entry.start)}</Td>
                  <Td>{dayjs().to(entry.end)}</Td>
                  <Td>{dayjs.duration(new Date(entry.end).getTime() - new Date(entry.start).getTime()).humanize()}</Td>
                  <Td>
                    <Link to={`beeps/${entry.id}`}>
                      <ExternalLinkIcon />
                    </Link>
                  </Td>
                </Tr>
              )
            })}
          </Tbody>
        </Table>
        {loading &&
          <Center h="100px">
            <Spinner size="xl" />
          </Center>
        }
      </Card>
      <Pagination
        resultCount={data?.getBeeps.count}
        limit={pageLimit}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onPageChange={fetchBeeps}
      />
    </Box>
  );
}

export default Beeps;