import React from 'react'
import { Table, Thead, Tbody, Tr, Th, Td, Box } from "@chakra-ui/react"
import { useQuery } from '@apollo/client';
import { TdUser } from '../../../components/TdUser';
import { Error } from '../../../components/Error';
import { Loading } from '../../../components/Loading';
import { Pagination } from '../../../components/Pagination';
import { leaderboardsRoute } from '.';
import { useNavigate } from '@tanstack/react-router';
import { graphql } from 'gql.tada';

export const UsersWithBeeps = graphql(`
  query getUsersWithBeeps($show: Int, $offset: Int) {
    getUsersWithBeeps(show: $show, offset: $offset) {
      items {
        user {
          id
          photo
          name
        }
        beeps
      }
      count
    }
  }
`);

const pageLimit = 20;

export function Beeps() {
  const { page } = leaderboardsRoute.useSearch();
  const navigate = useNavigate();
  const { loading, error, data, previousData } = useQuery(UsersWithBeeps, {
    variables: {
      show: pageLimit,
      offset: (page - 1) * pageLimit,
    }
  });

  const setCurrentPage = (page: number) => {
    navigate({ search: { page }, params: {} });
  };

  if (error) {
    return <Error error={error} />;
  }

  const beeps = data?.getUsersWithBeeps.items ?? previousData?.getUsersWithBeeps.items;
  const count = data?.getUsersWithBeeps.count ?? previousData?.getUsersWithBeeps.count;

  return (
    <Box>
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
              <Th>Beeps</Th>
            </Tr>
          </Thead>
          <Tbody>
            {beeps?.map(({ user, beeps }) => (
              <Tr key={user.id}>
                <TdUser user={user} />
                <Td>{beeps}</Td>
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
