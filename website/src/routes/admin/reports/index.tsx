import React, { useState } from 'react'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import TdUser from '../../../components/TdUser';
import ReportDrawer from './Drawer';
import Loading from '../../../components/Loading';
import Pagination from '../../../components/Pagination';
import { Indicator } from '../../../components/Indicator';
import { gql, useQuery } from '@apollo/client';
import { GetReportsQuery } from '../../../generated/graphql';
import { Error } from '../../../components/Error';
import { Box, Heading, Table, Tbody, Td, Th, Thead, Tr, useColorModeValue, useDisclosure } from '@chakra-ui/react';

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
  const pageLimit = 25;

  const bg = useColorModeValue('gray.50', 'gray.700');

  const { data, loading, error, refetch } = useQuery<GetReportsQuery>(ReportsGraphQL, {
    variables: {
      offset: 0,
      show: pageLimit
    }
  });

  const reports = data?.getReports.items;

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [id, setId] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  async function fetchReports(page: number) {
    refetch({
      variables: {
        offset: page
      }
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
        currentPage={currentPage}
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
        currentPage={currentPage}
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

export default Reports;
