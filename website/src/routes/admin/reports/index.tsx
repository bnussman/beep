import React, { useState } from 'react'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { TdUser } from '../../../components/TdUser';
import { ReportDrawer } from './Drawer';
import { Loading } from '../../../components/Loading';
import { Pagination } from '../../../components/Pagination';
import { Indicator } from '../../../components/Indicator';
import { useQuery } from '@apollo/client';
import { Error } from '../../../components/Error';
import { Box, Heading, Table, Tbody, Td, Th, Thead, Tr, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import { Route, useNavigate } from '@tanstack/react-router';
import { adminRoute } from '..';
import { graphql } from '../../../graphql';

dayjs.extend(relativeTime);

export const ReportsGraphQL = graphql(`
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
`);

export const reportsRoute = new Route({
  path: 'reports',
  getParentRoute: () => adminRoute,
});

export const reportsListRoute = new Route({
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
  const [id, setId] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate({ from: reportsListRoute.id });

  const { data, loading, error } = useQuery(ReportsGraphQL, {
    variables: {
      offset: (page - 1) * pageLimit,
      show: pageLimit
    }
  });

  const setCurrentPage = (page: number) => {
    navigate({ search: { page } });
  };

  const reports = data?.getReports.items;

  function openReport(id: string) {
    setId(id);
    onOpen();
  }

  if (error) return <Error error={error} />;

  return (
    <Box>
      <Heading>Reports</Heading>
      <Pagination
        resultCount={data?.getReports.count}
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
            {reports?.map((report) => (
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
      {loading && <Loading />}
      <Pagination
        resultCount={data?.getReports.count}
        limit={pageLimit}
        currentPage={page}
        setCurrentPage={setCurrentPage}
      />
      <ReportDrawer
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        id={id}
      />
    </Box>
  );
}
