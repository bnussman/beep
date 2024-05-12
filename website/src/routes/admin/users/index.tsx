import React from 'react'
import { Table, Thead, Tbody, Tr, Th, Td, Heading, Box, InputGroup, InputLeftElement, Input, InputRightElement, Spinner } from "@chakra-ui/react"
import { Indicator } from '../../../components/Indicator';
import { Pagination } from '../../../components/Pagination';
import { useQuery } from '@apollo/client';
import { TdUser } from '../../../components/TdUser';
import { Error } from '../../../components/Error';
import { SearchIcon } from '@chakra-ui/icons';
import { Loading } from '../../../components/Loading';
import { createRoute, useNavigate } from '@tanstack/react-router';
import { adminRoute } from '..';
import { graphql } from 'gql.tada';

export const UsersGraphQL = graphql(`
  query getUsers($show: Int, $offset: Int, $query: String) {
    getUsers(show: $show, offset: $offset, query: $query) {
      items {
        id
        photo
        name
        email
        isStudent
        isEmailVerified
        username
        phone
        isBeeping
      }
      count
    }
  }
`);

export interface PaginationSearchParams {
  page: number;
  query?: string;
}

export const usersRoute = createRoute({
  path: 'users',
  getParentRoute: () => adminRoute,
});

export const usersListRoute = createRoute({
  component: Users,
  path: '/',
  getParentRoute: () => usersRoute,
  validateSearch: (search: Record<string, string>): PaginationSearchParams => {
    return {
      page: Number(search?.page ?? 1),
      query: search.query ? search.query : undefined,
    }
  },
});

export function Users() {
  const pageLimit = 20;
  const { page, query } = usersListRoute.useSearch();
  const navigate = useNavigate({ from: usersListRoute.id });

  const { loading, error, data, previousData } = useQuery(UsersGraphQL, {
    variables: {
      offset: (page - 1) * pageLimit,
      show: pageLimit,
      query: !query ? undefined : query
    }
  });

  const setCurrentPage = (page: number) => {
    navigate({ search: (prev) => ({ ...prev, page }) })
  };

  const setQuery = (query: string) => {
    if (!query) {
      navigate({
        search: (prev) => ({ ...prev, query: undefined })
      })
    } else {
      navigate({
        search: (prev) => ({ ...prev, query })
      })
    }
  };

  const users = data?.getUsers ?? previousData?.getUsers;

  if (error) {
    return <Error error={error} />;
  }

  return (
    <Box>
      <Heading>Users</Heading>
      <Pagination
        resultCount={users?.count}
        limit={pageLimit}
        currentPage={page}
        setCurrentPage={setCurrentPage}
      />
      <InputGroup mb={4}>
        <InputLeftElement>
          <SearchIcon color="gray.300" />
        </InputLeftElement>
        <Input
          type="text"
          placeholder="Search"
          value={query ?? ""}
          onChange={(e) => setQuery(e.target.value)}
        />
        {(query && loading) && (
          <InputRightElement>
            <Spinner />
          </InputRightElement>
        )}
      </InputGroup>
      <Box overflowX="auto">
        <Table>
          <Thead>
            <Tr>
              <Th>User</Th>
              <Th>Email</Th>
              <Th>Student</Th>
              <Th>Email Verified</Th>
              <Th>Beeping</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users?.items.map((user) => (
              <Tr key={user.id}>
                <TdUser user={user} />
                <Td>{user.email}</Td>
                <Td><Indicator color={user.isStudent ? 'green' : 'red'} /></Td>
                <Td><Indicator color={user.isEmailVerified ? "green" : 'red'} /></Td>
                <Td><Indicator color={user.isBeeping ? 'green' : 'red'} /></Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      {loading && <Loading />}
      <Pagination
        resultCount={users?.count}
        limit={pageLimit}
        currentPage={page}
        setCurrentPage={setCurrentPage}
      />
    </Box>
  );
}
