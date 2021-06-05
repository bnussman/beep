import React, { useState } from 'react'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Card } from '../../../components/Card';
import { Indicator } from '../../../components/Indicator';
import Pagination from '../../../components/Pagination';
import { gql, useQuery } from '@apollo/client';
import { GetReportsQuery } from '../../../generated/graphql';
import { Box, Center, Heading, Spinner, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import TdUser from '../../../components/TdUser';
import { NavLink } from 'react-router-dom';
import { ExternalLinkIcon } from '@chakra-ui/icons';

dayjs.extend(relativeTime);

const ReportsGraphQL = gql`
    query getReports($show: Int, $offset: Int) {
        getReports(show: $show, offset: $offset) {
            items {
                id
                timestamp
                reason
                notes
                handled
                reporter {
                    id
                    name
                    photoUrl
                    username
                }
                reported {
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

function Reports() {
  const { data, loading, refetch } = useQuery<GetReportsQuery>(ReportsGraphQL, { variables: { offset: 0, show: 25 } });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageLimit = 25;

  async function fetchReports(page: number) {
    refetch({
      variables: {
        offset: page
      }
    });
  }

  return (
    <Box>
      <Heading>Reports</Heading>
      <Pagination
        resultCount={data?.getReports.count}
        limit={pageLimit}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onPageChange={fetchReports}
      />
      <Card>
        <Table>
          <Thead>
            <Tr>
              <Th>Reporter</Th>
              <Th>Reported User</Th>
              <Th>Reason</Th>
              <Th>Date</Th>
              <Th>Handled?</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.getReports && (data.getReports.items).map(report => {
              return (
                <Tr key={report.id}>
                  <TdUser user={report.reporter} />
                  <TdUser user={report.reported} />
                  <Td>{report.reason}</Td>
                  <Td>{dayjs().to(report.timestamp)}</Td>
                  <Td>
                    {report.handled
                      ? <Indicator color='green' />
                      : <Indicator color='red' />
                    }
                  </Td>
                  <Td>
                    <NavLink to={`/admin/reports/${report.id}`}>
                      <ExternalLinkIcon />
                    </NavLink>
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
        resultCount={data?.getReports.count}
        limit={pageLimit}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onPageChange={fetchReports}
      />
    </Box>
  );
}

export default Reports;