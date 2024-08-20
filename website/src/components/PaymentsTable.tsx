import React, { useState } from 'react';
import { Pagination } from './Pagination';
import { Box, Center, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { Loading } from './Loading';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import { createRoute } from '@tanstack/react-router';
import { userRoute } from '../routes/admin/users/User';
import { trpc } from '../utils/trpc';

dayjs.extend(duration);
dayjs.extend(relativeTime);

export const paymentsTableRoute = createRoute({
  component: PaymentsTable,
  path: 'payments',
  getParentRoute: () => userRoute,
});

export function PaymentsTable() {
  const pageLimit = 5;
  const { userId } = paymentsTableRoute.useParams();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data, isLoading } = trpc.payment.payments.useQuery({
    userId,
    offset: (currentPage - 1) * pageLimit,
    limit: pageLimit
  });

  if (data?.count === 0) {
    return (
      <Center h="100px">
        This user has no payments.
      </Center>
    );
  }

  if (isLoading) {
    return <Loading />;
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
              <Th>RevenuCat ID</Th>
              <Th>Product ID</Th>
              <Th>Price</Th>
              <Th>Purchased</Th>
              <Th>Expires</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.payments.map((payment) => (
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
        resultCount={data?.count}
        limit={pageLimit}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </Box>
  );
}
