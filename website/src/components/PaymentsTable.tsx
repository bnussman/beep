import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { Pagination } from './Pagination';
import { Box, Center, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { Loading } from './Loading';
import { UserPaymentsQuery } from '../generated/graphql';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);

interface Props {
  userId: string;
}

const PaymentsQuery = gql`
  query UserPayments($id: String, $offset: Int, $show: Int) {
    getPaymentHistory(id: $id, offset: $offset, show: $show) {
      items {
        id
        productId
        price
        created
        expires
      }
      count
    }
  }
`;

export function PaymentsTable(props: Props) {
  const pageLimit = 5;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data, loading } = useQuery<UserPaymentsQuery>(
    PaymentsQuery,
    {
      variables: {
        id: props.userId,
        offset: (currentPage - 1) * pageLimit,
        show: pageLimit
      }
    }
  );

  const payments = data?.getPaymentHistory.items;
  const count = data?.getPaymentHistory.count;

  if (count === 0) {
    return (
      <Center h="100px">
        This user has no payments.
      </Center>
    );
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <Box>
      <Pagination
        resultCount={count}
        limit={pageLimit}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <Box overflowX="auto">
        <Table>
          <Thead>
            <Tr>
              <Th>Make</Th>
              <Th>Model</Th>
              <Th>Year</Th>
              <Th>Color</Th>
              <Th>Created</Th>
              <Th>Photo</Th>
              <Th>Default</Th>
            </Tr>
          </Thead>
          <Tbody>
            {payments?.map((payment) => (
              <Tr key={payment.id}>
                <Td>{payment.id}</Td>
                <Td>{payment.productId}</Td>
                <Td>{payment.price}</Td>
                <Td>{payment.created}</Td>
                <Td>{payment.expires}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <Pagination
        resultCount={count}
        limit={pageLimit}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </Box>
  );
}
