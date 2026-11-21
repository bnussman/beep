import React from "react";
import { useSubscription } from "../utils/subscriptions";
import { orpc } from "../utils/orpc";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { Avatar, Spinner } from "@heroui/react";
import { Link as RouterLink } from "./Link";
import { BeepStatusChip } from "./BeepStatusChip";

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
      <div className="flex h-25 items-center justify-center">
        <Spinner size="sm" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-25 items-center justify-center">
        {error.message}
      </div>
    );
  }

  if (data?.length === 0) {
    return (
      <div className="flex h-25 items-center justify-center">
        This user's queue is empty.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {data?.map((beep) => (
        <div className="flex flex-row gap-4 justify-between" key={beep.id}>
          <RouterLink to="/admin/users/$userId" params={{ userId: beep.rider.id }}>
            <div className="flex items-center gap-2 w-full">
              <Avatar className="size-6">
                <Avatar.Image alt={`${beep.rider.first} ${beep.rider.last}`} src={beep.rider.photo || undefined} />
                <Avatar.Fallback>{beep.rider.first.at(0)?.toUpperCase()}{beep.rider.last.at(0)?.toUpperCase()}</Avatar.Fallback>
              </Avatar>
              <span className="whitespace-nowrap">
                {beep.rider.first} {beep.rider.last}
              </span>
              <div className="flex-1" />
            </div>
          </RouterLink>
          <BeepStatusChip status={beep.status} />
        </div>
      ))}
    </div>
  );
}
