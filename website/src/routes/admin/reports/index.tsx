import React, { useState } from 'react'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Indicator } from '../../../components/Indicator';
import Pagination from '../../../components/Pagination';
import { gql, useQuery } from '@apollo/client';
import { GetReportsQuery } from '../../../generated/graphql';
import { Box, Button, Heading, Table, Tbody, Td, Th, Thead, Tr, useDisclosure } from '@chakra-ui/react';
import TdUser from '../../../components/TdUser';
import ReportDrawer from './Drawer';
import Loading from '../../../components/Loading';
import { Error } from '../../../components/Error';

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

  const { data, loading, error, refetch } = useQuery<GetReportsQuery>(ReportsGraphQL, {
    variables: {
      offset: 0,
      show: pageLimit
    }
  });

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
          {data?.getReports && (data.getReports.items).map(report => (
            <Tr key={report.id} onClick={() => openReport(report.id)}>
              <TdUser user={report.reporter} />
              <TdUser user={report.reported} />
              <Td>{report.reason}</Td>
              <Td>{dayjs().to(report.timestamp)}</Td>
              <Td><Indicator color={report.handled ? 'green' : 'red'} /></Td>
              <Td>
                <Button colorScheme="brand" onClick={() => openReport(report.id)}>
                  Open
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
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
