import React from 'react'
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Indicator } from './Indicator';
import { Link } from '@tanstack/react-router';
import { trpc } from '../utils/trpc';
import { beepStatusMap } from '../routes/admin/beeps';
import { Avatar, Box, CircularProgress, Stack, Typography } from '@mui/material';

dayjs.extend(duration);

interface Props {
  userId: string;
}

export function QueuePreview({ userId }: Props) {
  const utils = trpc.useUtils();

  const { data, isLoading, error } = trpc.beeper.queue.useQuery(userId);

  trpc.beeper.watchQueue.useSubscription(userId, {
    onData(queue) {
      utils.beeper.queue.setData(userId, queue);
    }
  });

  if (isLoading) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" height="100px">
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" height="100px">
        {error.message}
      </Box>
    );
  }

  if (data?.length === 0) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" height="100px">
        This user's queue is empty.
      </Box>
    );
  }

  return (
    <Box>
      {data?.map((beep) => (
        <Stack key={beep.id} direction="row">
          <Link to="/admin/users/$userId" params={{ userId: beep.rider.id }}>
            <Avatar src={beep.rider.photo || ''} sx={{ width: 16, height: 16 }} />
          </Link>
          <Link to="/admin/users/$userId" params={{ userId: beep.rider.id }}>
            <Box fontWeight="bold" whiteSpace="nowrap">{beep.rider.first} {beep.rider.last}</Box>
          </Link>
          <Typography>
            {beep.status.replaceAll("_", ' ')}
          </Typography>
          <Indicator color={beepStatusMap[beep.status]} />
        </Stack>
      ))}
    </Box>
  );
}
