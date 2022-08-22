import React, { useEffect } from 'react'
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Indicator } from './Indicator';
import { UsersQueueQuery } from '../generated/graphql';
import { Text, Avatar, Box, Center, HStack, Spacer, Spinner } from '@chakra-ui/react';
import { client } from '../utils/Apollo';
import { gql, useQuery } from '@apollo/client';
import { QueueSubscription } from './QueueTable';
import { Link } from 'react-router-dom';

export function getStatus(value: number): string {
  switch (value) {
    case 0:
      return "waiting";
    case 1:
      return "accepted";
    case 2:
      return "on the way";
    case 3:
      return "here";
    case 4:
      return "getting beeped";
    default:
      return "yikes";
  }
}

dayjs.extend(duration);

let sub: any;

const QueueQuery = gql`
  query UsersQueue($id: String) {
    getQueue(id: $id) {
      id
      state
      rider {
        id
        name
        photoUrl
      }
    }
  }
`;

interface Props {
  user: { id: string; };
}

export function QueuePreview({ user }: Props) {
  const { data, loading, error } = useQuery<UsersQueueQuery>(QueueQuery, { variables: { id: user.id } });

  const queue = data?.getQueue;

  async function subscribe() {
    const a = client.subscribe({ query: QueueSubscription, variables: { id: user.id } });

    sub = a.subscribe(({ data }) => {
      client.writeQuery({
        query: QueueQuery,
        data: {
          getQueue: data.getBeeperUpdates
        },
        variables: { id: user.id }
      });
    });
  }

  useEffect(() => {
    subscribe();

    return () => {
      sub?.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  if (error) {
    return (
      <Center>
        {error.message}
      </Center>
    );
  }

  if (queue?.length === 0) {
    return (
      <Center h="100px">
        This user's queue is empty.
      </Center>
    );
  }

  return (
    <Box>
      {queue && queue.map((entry) => (
        <HStack key={entry.id}>
          <Link to={`/admin/users/${entry.rider.id}`}>
            <Avatar src={entry.rider.photoUrl || ''} size="xs" />
          </Link>
          <Link to={`/admin/users/${entry.rider.id}`}>
            <Box fontWeight="bold" whiteSpace="nowrap">{entry.rider.name}</Box>
          </Link>
          <Text noOfLines={1}>
            {getStatus(entry.state)}
          </Text>
          <Spacer />
          <Indicator color={entry.state > 0 ? 'green' : 'red'} />
        </HStack>
      ))}
    </Box>
  );
}