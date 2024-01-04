import React from 'react'
import { Table, Thead, Tbody, Tr, Th, Td, Box } from "@chakra-ui/react"
import { gql, useQuery } from '@apollo/client';
import { TdUser } from '../../../components/TdUser';
import { Error } from '../../../components/Error';
import { Loading } from '../../../components/Loading';
import { Pagination } from '../../../components/Pagination';
import { GetUsersWithRidesQuery } from '../../../generated/graphql';
import { leaderboardsRoute } from '.';
import { useNavigate } from '@tanstack/react-router';

export const UsersWithRides = gql`
  query getUsersWithRides($show: Int, $offset: Int) {
    getUsersWithRides(show: $show, offset: $offset) {
      items {
        user {
          id
          photo
          name
        }
        rides
      }
      count
    }
  }
`;

const pageLimit = 20;

export function Rides() {
  const { page } = leaderboardsRoute.useSearch();
  const navigate = useNavigate({ from: leaderboardsRoute.id });

  const { loading, error, data } = useQuery<GetUsersWithRidesQuery>(UsersWithRides, {
    variables: {
      show: pageLimit,
      offset: (page - 1) * pageLimit,
    }
  });

  const setCurrentPage = (page: number) => {
    navigate({ search: { page } });
  };

  if (error) {
    return <Error error={error} />;
  }

  return (
    <Box>
      <Pagination
        resultCount={data?.getUsersWithRides.count}
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
            {data?.getUsersWithRides.items.map(({ user, rides }) => (
              <Tr key={user.id}>
                <TdUser user={user} />
                <Td>{rides}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      {loading && <Loading />}
      <Pagination
        resultCount={data?.getUsersWithRides.count}
        limit={pageLimit}
        currentPage={page}
        setCurrentPage={setCurrentPage}
      />
    </Box>
  );
}