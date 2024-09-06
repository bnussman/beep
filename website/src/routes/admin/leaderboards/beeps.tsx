import React from 'react'
import { Table, Thead, Tbody, Tr, Th, Td, Box } from "@chakra-ui/react"
import { TdUser } from '../../../components/TdUser';
import { Error } from '../../../components/Error';
import { Loading } from '../../../components/Loading';
import { Pagination } from '../../../components/Pagination';
import { leaderboardsRoute } from '.';
import { useNavigate } from '@tanstack/react-router';
import { trpc } from '../../../utils/trpc';

const pageLimit = 20;

export function Beeps() {
  const { page } = leaderboardsRoute.useSearch();
  const navigate = useNavigate({ from: leaderboardsRoute.id });
  const { isPending, error, data } = trpc.user.usersWithBeeps.useQuery({
    show: pageLimit,
    offset: (page - 1) * pageLimit,
  });

  const setCurrentPage = (page: number) => {
    navigate({ search: { page }, params: {} });
  };

  if (error) {
    return <Error>{error.message}</Error>;
  }

  return (
    <Box>
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
              <Th>Beeps</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.users?.map(({ user, beeps }) => (
              <Tr key={user.id}>
                <TdUser user={user} />
                <Td>{beeps}</Td>
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
    </Box>
  );
}
