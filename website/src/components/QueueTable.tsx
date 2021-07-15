import React, { useEffect } from 'react'
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Indicator } from './Indicator';
import { User } from '../generated/graphql';
import TdUser from './TdUser';
import { Center, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { client } from '../utils/Apollo';
import { gql } from '@apollo/client';
import { GetUser } from '../routes/admin/users/User';

dayjs.extend(duration);

const GetQueue = gql`
    subscription GetQueue($id: String!) {
        getBeeperUpdates(id: $id) {
          id
          origin
          destination
          start
          groupSize
          isAccepted
          state
          rider {
            id
            photoUrl
            username
            first
            last
            name
          }
        }
    }
`;

interface Props {
  user: Partial<User>;
}

let sub: any;

function QueueTable(props: Props) {
  const { user } = props;

  async function subscribe() {
    const a = client.subscribe({ query: GetQueue, variables: { id: user.id } });

    sub = a.subscribe(({ data }) => {
      client.writeQuery({
        query: GetUser,
        data: {
          getUser: {
            ...user,
            queue: data.getBeeperUpdates
          }
        },
        variables: {
          id: user.id
        }
      });
    });
  }

  useEffect(() => {
    subscribe();

    return () => {
      sub?.unsubscribe();
    };
  }, []);


  function getStatus(value: number): string {
    switch (value) {
      case 0:
        return "Waiting...";
      case 1:
        return "Beeper is on the way";
      case 2:
        return "Beeper is here";
      case 3:
        return "Getting Beeped";
      default:
        return "yikes";
    }
  }

  if (!user.queue || user.queue.length === 0) {
    return (
      <Center h="100px">
        This user's queue is empty.
      </Center>
    );
  }

  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Rider</Th>
          <Th>Origin</Th>
          <Th>Destination</Th>
          <Th>Group Size</Th>
          <Th>Start Time</Th>
          <Th>Is Accepted?</Th>
          <Th>Status</Th>
        </Tr>
      </Thead>
      <Tbody>
        {user.queue && user.queue.map(entry => {
          return (
            <Tr key={entry.id}>
              <TdUser user={entry.rider} />
              <Td>{entry.origin}</Td>
              <Td>{entry.destination}</Td>
              <Td>{entry.groupSize}</Td>
              <Td>{dayjs().to(entry.start * 1000)}</Td>
              <Td>{entry.isAccepted ? <Indicator color='green' /> : <Indicator color='red' />}</Td>
              <Td>{getStatus(entry.state)}</Td>
            </Tr>
          )
        })}
      </Tbody>
    </Table>
  );
}

export default QueueTable;
