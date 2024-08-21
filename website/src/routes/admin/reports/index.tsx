import React, { useState } from 'react'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { TdUser } from '../../../components/TdUser';
import { ReportDrawer } from './Drawer';
import { Loading } from '../../../components/Loading';
import { Pagination } from '../../../components/Pagination';
import { Indicator } from '../../../components/Indicator';
import { Error } from '../../../components/Error';
import { Box, Heading, Table, Tbody, Td, Th, Thead, Tr, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import { createRoute, useNavigate } from '@tanstack/react-router';
import { adminRoute } from '..';
import { trpc } from '../../../utils/trpc';

dayjs.extend(relativeTime);

export const reportsRoute = createRoute({
  path: 'reports',
  getParentRoute: () => adminRoute,
});

export const reportsListRoute = createRoute({
  component: Reports,
  path: "/",
  getParentRoute: () => reportsRoute,
  validateSearch: (search: Record<string, string>) => ({
    page: Number(search?.page ?? 1),
  }),
});

export function Reports() {
  const pageLimit = 20;
  const { page } = reportsListRoute.useSearch();
  const bg = useColorModeValue('gray.50', 'rgb(20, 24, 28)');
  const [selectedReportId, setSelectedReportId] = useState<string | undefined>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate({ from: reportsListRoute.id });

  const { data, isPending, error } = trpc.report.reports.useQuery({
    offset: (page - 1) * pageLimit,
    show: pageLimit
  });

  const setCurrentPage = (page: number) => {
    navigate({ search: { page } });
  };

  function openReport(id: string) {
    setSelectedReportId(id);
    onOpen();
  }

  const selectedReport = data?.reports.find(r => r.id === selectedReportId);

  if (error) {
    return <Error>{error.message}</Error>;
  }

  return (
    <Box>
      <Heading>Reports</Heading>
      <Pagination
        resultCount={data?.count}
        limit={pageLimit}
        currentPage={page}
        setCurrentPage={setCurrentPage}
      />
      <Box overflowX="auto">
        <Table>
          <Thead>
            <Tr>
              <Th>Reporter</Th>
              <Th>Reported</Th>
              <Th>Reason</Th>
              <Th>Date</Th>
              <Th>Handled</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.reports.map((report) => (
              <Tr
                key={report.id}
                onClick={() => openReport(report.id)}
                _hover={{
                  cursor: 'pointer',
                  bg
                }}
              >
                <TdUser user={report.reporter} />
                <TdUser user={report.reported} />
                <Td>{report.reason}</Td>
                <Td>{dayjs().to(report.timestamp)}</Td>
                <Td><Indicator color={report.handled ? 'green' : 'red'} /></Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      {isPending && <Loading />}
      <Pagination
        resultCount={data?.count}
        limit={pageLimit}
        currentPage={page}
        setCurrentPage={setCurrentPage}
      />
      <ReportDrawer
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        report={selectedReport}
      />
    </Box>
  );
}
