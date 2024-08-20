import React from 'react'
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Indicator } from './Indicator';
import { Text, Avatar, Box, Center, HStack, Spacer, Spinner } from '@chakra-ui/react';
import { Status } from '../types/User';
import { Link } from '@tanstack/react-router';
import { trpc } from '../utils/trpc';

dayjs.extend(duration);

interface Props {
  userId: string;
}

export function QueuePreview({ userId }: Props) {
  const { data, isLoading, error } = trpc.beep.beeps.useQuery({
    userId,
    show: 500,
    offset: 0,
  });

  // @todo subscribe to queue for realtime updates

  if (isLoading) {
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

  if (data?.count === 0) {
    return (
      <Center h="100px">
        This user's queue is empty.
      </Center>
    );
  }

  return (
    <Box>
      {data?.beeps?.map((beep) => (
        <HStack key={beep.id}>
          <Link to="/admin/users/$userId" params={{ userId: beep.rider.id }}>
            <Avatar src={beep.rider.photo || ''} size="xs" />
          </Link>
          <Link to="/admin/users/$userId" params={{ userId: beep.rider.id }}>
            <Box fontWeight="bold" whiteSpace="nowrap">{beep.rider.first} {beep.rider.last}</Box>
          </Link>
          <Text noOfLines={1}>
            {beep.status}
          </Text>
          <Spacer />
          <Indicator color={beep.status !== Status.WAITING ? 'green' : 'red'} />
        </HStack>
      ))}
    </Box>
  );
}
