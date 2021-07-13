import React, { useEffect, useState } from 'react'
import { Indicator } from '../../../components/Indicator';
import Pagination from '../../../components/Pagination';
import { gql, useQuery } from '@apollo/client';
import { GetUsersQuery } from '../../../generated/graphql';
import TdUser from '../../../components/TdUser';
import { Error } from '../../../components/Error';
import { SearchIcon } from '@chakra-ui/icons';
import Loading from '../../../components/Loading';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Box,
  InputGroup,
  InputLeftElement,
  Input
} from "@chakra-ui/react"

export const UsersGraphQL = gql`
    query getUsers($show: Int, $offset: Int, $query: String) {
        getUsers(show: $show, offset: $offset, query: $query) {
            items {
                id
                photoUrl
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
`;

function Users() {
  const pageLimit = 20;
  const { loading, error, data, refetch } = useQuery<GetUsersQuery>(UsersGraphQL, { variables: { offset: 0, show: pageLimit } });
  const [query, setQuery] = useState<string>();
  const [currentPage, setCurrentPage] = useState<number>(1);

  async function fetchUsers(page: number) {
    refetch({
      offset: page
    })
  }

  useEffect(() => {
    setCurrentPage(1);
    refetch({
      offset: 0,
      query
    });
  }, [query]);

  if (error) return <Error error={error} />;

  return (
    <Box>
      <Heading>Users</Heading>
      <Pagination
        resultCount={data?.getUsers?.count}
        limit={pageLimit}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onPageChange={fetchUsers}
      />
      <InputGroup mb={4}>
        <InputLeftElement
          pointerEvents="none"
          children={<SearchIcon color="gray.300" />}
        />
        <Input
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </InputGroup>
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
          {data?.getUsers && (data?.getUsers.items).map(user => {
            return (
              <Tr key={user.id}>
                <TdUser user={user} />
                <Td>{user.email}</Td>
                <Td><Indicator color={user.isStudent ? 'green' : 'red'} /></Td>
                <Td><Indicator color={user.isEmailVerified ? "green" : 'red'} /></Td>
                <Td><Indicator color={user.isBeeping ? 'green' : 'red'} /></Td>
              </Tr>
            )
          })}
        </Tbody>
      </Table>
      {loading && <Loading />}
      <Pagination
        resultCount={data?.getUsers.count}
        limit={pageLimit}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onPageChange={fetchUsers}
      />
    </Box>
  );
}

export default Users;
