import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Pagination } from './Pagination';
import { Box, Center, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { Loading } from './Loading';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Route } from '@tanstack/react-router';
import { userRoute } from '../routes/admin/users/User';
import { graphql } from '../graphql';

dayjs.extend(duration);
dayjs.extend(relativeTime);

const PaymentsQuery = graphql(`
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
`);

export const paymentsTableRoute = new Route({
  component: PaymentsTable,
  path: 'payments',
  getParentRoute: () => userRoute,
});


export function PaymentsTable() {
  const pageLimit = 5;
  const { userId } = paymentsTableRoute.useParams();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data, loading } = useQuery(
    PaymentsQuery,
    {
      variables: {
        id: userId,
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
              <Th>RevenuCat ID</Th>
              <Th>Product ID</Th>
              <Th>Price</Th>
              <Th>Purchased</Th>
              <Th>Expires</Th>
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
