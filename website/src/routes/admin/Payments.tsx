import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Pagination } from '../../components/Pagination';
import { gql, useQuery } from '@apollo/client';
import { Box, Heading, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { TdUser } from '../../components/TdUser';
import { Loading } from '../../components/Loading';
import { Error } from '../../components/Error';
import { PaymentsQuery } from '../../generated/graphql';
import { Route, useNavigate } from '@tanstack/react-router';
import { adminRoute } from '.';

dayjs.extend(relativeTime);

const PaymentsGQL = gql`
  query Payments($offset: Int, $show: Int) {
    getPayments(offset: $offset, show: $show) {
      items {
        id
        created
        expires
        price
        store
        productId
        user {
          id
          photo
          name
        }
      }
      count
    }
  }
`;

export const paymentsRoute = new Route({
  component: Payments,
  path: '/payments',
  getParentRoute: () => adminRoute,
  validateSearch: (search: Record<string, string>) => ({ page: Number(search?.page ?? 1)})
});


export function Payments() {
  const pageLimit = 20;

  const { page } = paymentsRoute.useSearch();

  const navigate = useNavigate({ from: paymentsRoute.id });

  const { data, loading, error } = useQuery<PaymentsQuery>(PaymentsGQL, {
    variables: {
      offset: (page - 1) * pageLimit,
      show: pageLimit
    }
  });

  const payments = data?.getPayments.items;
  const count = data?.getPayments.count;

  const setCurrentPage = (page: number) => {
    navigate({ search: { page } });
  };

  if (error) {
    return <Error error={error} />;
  }

  return (
    <Box>
      <Heading>Payments</Heading>
      <Pagination
        resultCount={count}
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
            {payments?.map((payment) => (
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
      {loading && <Loading />}
      <Pagination
        resultCount={count}
        limit={pageLimit}
        currentPage={page}
        setCurrentPage={setCurrentPage}
      />
    </Box>
  );
}
