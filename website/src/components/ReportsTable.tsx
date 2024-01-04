import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { GetReportsQuery } from '../generated/graphql';
import { Pagination } from './Pagination';
import { Box, Center, Spinner, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { TdUser } from './TdUser';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Indicator } from './Indicator';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Link, Route } from '@tanstack/react-router';
import { userRoute } from '../routes/admin/users/User';

dayjs.extend(duration);

const Reports = gql`
  query GetReportsForUser($id: String, $show: Int, $offset: Int) {
    getReports(id: $id, show: $show, offset: $offset) {
      items {
        id
        timestamp
        reason
        handled
        handledBy {
          id
          name
          photo
          username
        }
        reporter {
          id
          name
          photo
          username
        }
        reported {
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

export const reportsTableRoute = new Route({
  component: ReportsTable,
  path: 'reports',
  getParentRoute: () => userRoute,
});

export function ReportsTable() {
  const { userId } = reportsTableRoute.useParams();
  const pageLimit = 5;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data, loading } = useQuery<GetReportsQuery>(
    Reports,
    {
      variables: {
        id: userId,
        offset: (currentPage - 1) * pageLimit,
        show: pageLimit
      }
    }
  );

  if (data?.getReports && data.getReports.items.length === 0) {
    return (
      <Center h="100px">
        This user has no reports.
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
        resultCount={data?.getReports.count}
        limit={pageLimit}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <Box overflowX="auto">
        <Table>
          <Thead>
            <Tr>
              <Th>Reporter</Th>
              <Th>Reported User</Th>
              <Th>Reason</Th>
              <Th>Date</Th>
              <Th>Done</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.getReports.items.map((report) => (
              <Tr key={report.id}>
                <TdUser user={report.reporter} />
                <TdUser user={report.reported} />
                <Td>{report.reason}</Td>
                <Td>{dayjs().to(report.timestamp)}</Td>
                <Td><Indicator color={report.handled ? 'green' : 'red'} /></Td>
                <Td>
                  <Link to="/admin/reports/$reportId" params={{ reportId: report.id }}>
                    <ExternalLinkIcon />
                  </Link>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <Pagination
        resultCount={data?.getReports.count}
        limit={pageLimit}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </Box>
  );
}
