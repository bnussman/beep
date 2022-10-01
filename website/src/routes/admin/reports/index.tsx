import React, { useState } from 'react'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { TdUser } from '../../../components/TdUser';
import { ReportDrawer } from './Drawer';
import { Loading } from '../../../components/Loading';
import { Pagination } from '../../../components/Pagination';
import { Indicator } from '../../../components/Indicator';
import { gql, useQuery } from '@apollo/client';
import { GetReportsQuery } from '../../../generated/graphql';
import { Error } from '../../../components/Error';
import { Box, Heading, Table, Tbody, Td, Th, Thead, Tr, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import { useSearchParams } from 'react-router-dom';

dayjs.extend(relativeTime);

export const ReportsGraphQL = gql`
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
`;

export function Reports() {
  const pageLimit = 20;
  const [searchParams, setSearchParams] = useSearchParams();
  const bg = useColorModeValue('gray.50', 'gray.700');
  const page = searchParams.has('page') ? Number(searchParams.get('page')) : 1;
  const [id, setId] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data, loading, error, refetch } = useQuery<GetReportsQuery>(ReportsGraphQL, {
    variables: {
      offset: (page - 1) * pageLimit,
      show: pageLimit
    }
  });

  const setCurrentPage = (page: number) => {
    setSearchParams({ page: String(page) });
  };

  const reports = data?.getReports.items;

  const fetchReports = async (page: number) => {
    refetch({
      offset: page
    });
  }

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
        onPageChange={fetchReports}
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
            {reports?.map(report => (
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
        onPageChange={fetchReports}
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