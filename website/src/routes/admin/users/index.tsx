import React, { useState } from 'react'
import { formatPhone } from '../../../utils/formatters';
import { Card } from '../../../components/Card';
import { Indicator } from '../../../components/Indicator';
import Pagination from '../../../components/Pagination';
import { gql, useQuery } from '@apollo/client';
import { GetUsersQuery } from '../../../generated/graphql';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Box,
  Center,
  Spinner
} from "@chakra-ui/react"
import TdUser from '../../../components/TdUser';
import { Error } from '../../../components/Error';

export const UsersGraphQL = gql`
    query getUsers($show: Int, $offset: Int) {
        getUsers(show: $show, offset: $offset) {
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
  const { loading, error, data, refetch } = useQuery<GetUsersQuery>(UsersGraphQL, { variables: { offset: 0, show: 25 } });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageLimit = 25;

  async function fetchUsers(page: number) {
    refetch({
      offset: page
    })
  }

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
      <Card>
        <Table>
          <Thead>
            <Tr>
              <Th>User</Th>
              <Th>Email</Th>
              <Th>Phone</Th>
              <Th>Is Student?</Th>
              <Th>Is Email Verified?</Th>
              <Th>Is beeping?</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.getUsers && (data?.getUsers.items).map(user => {
              return (
                <Tr key={user.id}>
                  <TdUser user={user} />
                  <Td><a href={`mailto:${user.email}`} rel="noreferrer" target="_blank">{user.email}</a></Td>
                  <Td>{formatPhone(user.phone)}</Td>
                  <Td>
                    {user.isStudent
                      ? <Indicator color="green" />
                      : <Indicator color="red" />
                    }
                  </Td>
                  <Td>
                    {user.isEmailVerified
                      ? <Indicator color="green" />
                      : <Indicator color="red" />
                    }
                  </Td>
                  <Td>
                    {user.isBeeping
                      ? <Indicator color="green" />
                      : <Indicator color="red" />
                    }
                  </Td>
                </Tr>
              )
            })}
          </Tbody>
        </Table>
        {loading &&
          <Center h="100px">
            <Spinner size="xl" />
          </Center>
        }
      </Card>

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
