import React from "react";
import { Indicator } from "./Indicator";
import { Link as RouterLink } from "@tanstack/react-router";
import { trpc } from "../utils/trpc";
import { beepStatusMap } from "../routes/admin/beeps";
import {
  Link,
  Avatar,
  Box,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";

interface Props {
  userId: string;
}

export function QueuePreview({ userId }: Props) {
  const utils = trpc.useUtils();

  const { data, isLoading, error } = trpc.beeper.queue.useQuery(userId);

  trpc.beeper.watchQueue.useSubscription(userId, {
    onData(queue) {
      utils.beeper.queue.setData(userId, queue);
    },
  });

  if (isLoading) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100px"
      >
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100px"
      >
        {error.message}
      </Box>
    );
  }

  if (data?.length === 0) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100px"
      >
        This user's queue is empty.
      </Box>
    );
  }

  return (
    <Stack spacing={1}>
      {data?.map((beep) => (
        <Link component={RouterLink} to={`/admin/users/${beep.rider.id}`}>
          <Stack key={beep.id} direction="row" spacing={1} alignItems="center">
            <Avatar
              src={beep.rider.photo || ""}
              sx={{ width: 24, height: 24 }}
            />
            <Box fontWeight="bold" whiteSpace="nowrap">
              {beep.rider.first} {beep.rider.last}
            </Box>
            <Typography>{beep.status.replaceAll("_", " ")}</Typography>
            <Indicator color={beepStatusMap[beep.status]} />
          </Stack>
        </Link>
      ))}
    </Stack>
  );
}
