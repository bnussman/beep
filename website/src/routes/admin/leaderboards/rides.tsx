import React from 'react'
import { Table, Thead, Tbody, Tr, Th, Td, Box } from "@chakra-ui/react"
import { TdUser } from '../../../components/TdUser';
import { Error } from '../../../components/Error';
import { Loading } from '../../../components/Loading';
import { Pagination } from '../../../components/Pagination';
import { leaderboardsRoute } from '.';
import { createRoute, useNavigate } from '@tanstack/react-router';
import { trpc } from '../../../utils/trpc';

const pageLimit = 20;

export const ridesLeaderboard = createRoute({
  component: Rides,
  path: 'rides',
  getParentRoute: () => leaderboardsRoute,
  validateSearch: (search: Record<string, string>) => {
    return {
      page: Number(search?.page ?? 1),
    }
  },
});

export function Rides() {
  const { page } = ridesLeaderboard.useSearch();
  const navigate = useNavigate({ from: "/admin/leaderboards/rides" });

  const { isLoading, error, data } = trpc.user.usersWithRides.useQuery({
    show: pageLimit,
    offset: (page - 1) * pageLimit,
  });

  const setCurrentPage = (page: number) => {
    navigate({ search: { page } });
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
            {data?.users.map(({ user, rides }) => (
              <Tr key={user.id}>
                <TdUser user={user} />
                <Td>{rides}</Td>
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
