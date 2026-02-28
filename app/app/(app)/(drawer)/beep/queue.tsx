import React from "react";
import { useTRPC } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/utils/useUser";
import { Queue } from "@/components/beeper/Queue";

export default function StartBeepingScreen() {
  const trpc = useTRPC();
  const { user } = useUser();

  const {
    data: queue,
    refetch,
    isRefetching,
  } = useQuery(
    trpc.beeper.queue.queryOptions(undefined, {
      enabled: user && user.isBeeping,
    }),
  );

  return (
    <Queue
      beeps={queue?.filter((beep) => beep.id !== queue[0]?.id) ?? []}
      onRefresh={refetch}
      refreshing={isRefetching}
    />
  );
}

