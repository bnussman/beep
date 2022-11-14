import React from 'react'
import { Table, Thead, Tbody, Tr, Th, Td, Box } from "@chakra-ui/react"
import { gql, useQuery } from '@apollo/client';
import { TdUser } from '../../../components/TdUser';
import { Error } from '../../../components/Error';
import { Loading } from '../../../components/Loading';
import { GetUsersWithBeepsQuery } from '../../../generated/graphql';
import { useSearchParams } from 'react-router-dom';
import { Pagination } from '../../../components/Pagination';

export const UsersWithBeeps = gql`
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
`;

const pageLimit = 20;

export function Beeps() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.has('page') ? Number(searchParams.get('page')) : 1;
  const { loading, error, data } = useQuery<GetUsersWithBeepsQuery>(UsersWithBeeps, {
    variables: {
      show: pageLimit,
      offset: (page - 1) * pageLimit,
    }
  });

  const setCurrentPage = (page: number) => {
    setSearchParams({ page: String(page) });
  };

  if (error) {
    return <Error error={error} />;
  }

  return (
    <Box>
      <Pagination
        resultCount={data?.getUsersWithBeeps.count}
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
            {data?.getUsersWithBeeps.items.map(({ user, beeps }) => (
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
        resultCount={data?.getUsersWithBeeps.count}
        limit={pageLimit}
        currentPage={page}
        setCurrentPage={setCurrentPage}
      />
    </Box>
  );
}