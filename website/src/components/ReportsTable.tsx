import React, { useState } from 'react';
import { Pagination } from './Pagination';
import { Box, Center, Spinner, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { TdUser } from './TdUser';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Indicator } from './Indicator';
import { Link, createRoute } from '@tanstack/react-router';
import { userRoute } from '../routes/admin/users/User';
import { trpc } from '../utils/trpc';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export const reportsTableRoute = createRoute({
  component: ReportsTable,
  path: 'reports',
  getParentRoute: () => userRoute,
});

export function ReportsTable() {
  const { userId } = reportsTableRoute.useParams();
  const pageLimit = 5;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data, isLoading } = trpc.report.reports.useQuery({
    userId,
    offset: (currentPage - 1) * pageLimit,
    show: pageLimit
  });

  if (data?.count === 0) {
    return (
      <Center h="100px">
        This user has no reports.
      </Center>
    );
  }

  if (isLoading) {
    return (
      <Center h="100px">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box>
      <Pagination
        resultCount={data?.count}
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
            {data?.reports.map((report) => (
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
        resultCount={data?.count}
        limit={pageLimit}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </Box>
  );
}
