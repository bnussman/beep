import React, {  } from 'react'
import { Table, Thead, Tbody, Tr, Th, Td, Heading, Box } from "@chakra-ui/react"
import { gql, useQuery } from '@apollo/client';
import { TdUser } from '../../../components/TdUser';
import { Error } from '../../../components/Error';
import { Loading } from '../../../components/Loading';
import { GetUsersWithBeepsQuery } from '../../../generated/graphql';

export const UsersWithBeeps = gql`
  query getUsersWithBeeps {
    getUsersWithBeeps {
      user {
        id
        photo
        name
      }
      beeps
    }
  }
`;

export function UsersByBeeps() {
  const { loading, error, data } = useQuery<GetUsersWithBeepsQuery>(UsersWithBeeps);

  if (error) {
    return <Error error={error} />;
  }

  return (
    <Box>
      <Heading>Users</Heading>
      <Box overflowX="auto">
        <Table>
          <Thead>
            <Tr>
              <Th>User</Th>
              <Th>Beeps</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.getUsersWithBeeps.map(({ user, beeps }) => (
              <Tr key={user.id}>
                <TdUser user={user} />
                <Td>{beeps}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      {loading && <Loading />}
    </Box>
  );
}