import React from "react";
import { useSubscription } from "../utils/subscriptions";
import { orpc } from "../utils/orpc";
import { Indicator } from "./Indicator";
import { Link as RouterLink } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { beepStatusMap } from "../utils/utils";
import { Typography } from "@heroui/react";
import {
  Link,
  Avatar,
  Box,
  CircularProgress,
} from "@mui/material";

interface Props {
  userId: string;
}

export function QueuePreview({ userId }: Props) {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery(
    orpc.beeper.queue.queryOptions({ input: userId }),
  );

  useSubscription({
    ...orpc.beeper.watchQueue.liveOptions({
      input: userId,
      context: { ws: true }
    }),
    onData(data) {
      queryClient.setQueryData(orpc.beeper.queue.queryKey({ input: userId }), data);
    },
  })

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100px"
        }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100px"
        }}>
        {error.message}
      </Box>
    );
  }

  if (data?.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100px"
        }}>This user's queue is empty.
              </Box>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {data?.map((beep) => (
        <Link
          component={RouterLink}
          to={`/admin/users/${beep.rider.id}`}
          key={beep.id}
        >
          <div key={beep.id} className="flex items-center gap-2">
            <Avatar
              src={beep.rider.photo || ""}
              sx={{ width: 24, height: 24 }}
            />
            <Box
              sx={{
                fontWeight: "bold",
                whiteSpace: "nowrap"
              }}>
              {beep.rider.first} {beep.rider.last}
            </Box>
            <Typography>{beep.status.replaceAll("_", " ")}</Typography>
            <Indicator color={beepStatusMap[beep.status]} />
          </div>
        </Link>
      ))}
    </div>
  );
}
