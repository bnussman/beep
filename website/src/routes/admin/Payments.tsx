import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Pagination } from '../../components/Pagination';
import { useQuery } from '@apollo/client';
import { Box, Heading, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { TdUser } from '../../components/TdUser';
import { Loading } from '../../components/Loading';
import { Error } from '../../components/Error';
import { createRoute, useNavigate } from '@tanstack/react-router';
import { adminRoute } from '.';
import { graphql } from '../../graphql';
import { trpc } from '../../utils/trpc';

dayjs.extend(relativeTime);

export const paymentsRoute = createRoute({
  component: Payments,
  path: '/payments',
  getParentRoute: () => adminRoute,
  validateSearch: (search: Record<string, string>) => ({ page: Number(search?.page ?? 1)})
});

export function Payments() {
  const pageLimit = 20;

  const { page } = paymentsRoute.useSearch();

  const navigate = useNavigate({ from: paymentsRoute.id });

  const { data, isLoading, error } = trpc.payment.payments.useQuery({
    offset: (page - 1) * pageLimit,
    limit: pageLimit
  });

  const setCurrentPage = (page: number) => {
    navigate({ search: { page } });
  };

  if (error) {
    return <Error>{error.message}</Error>;
  }

  return (
    <Box>
      <Heading>Payments</Heading>
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
              <Th>User</Th>
              <Th>Product</Th>
              <Th>Price</Th>
              <Th>Store</Th>
              <Th>Created</Th>
              <Th>Expires</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.payments.map((payment) => (
              <Tr key={payment.id}>
                <TdUser user={payment.user} />
                <Td>{payment.productId}</Td>
                <Td>${payment.price}</Td>
                <Td>{payment.store}</Td>
                <Td>{new Date(payment.created).toLocaleString()}</Td>
                <Td>{new Date(payment.expires).toLocaleString()}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      {isLoading && <Loading />}
      <Pagination
        resultCount={data?.count}
        limit={pageLimit}
        currentPage={page}
        setCurrentPage={setCurrentPage}
      />
    </Box>
  );
}
