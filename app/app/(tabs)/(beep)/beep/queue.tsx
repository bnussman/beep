import React from "react";
import { useTRPC } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/utils/useUser";
import { Text } from "@/components/Text";
import { FlatList, View } from "react-native";
import { QueueItem } from "@/components/beeper/QueueItem";
import { getContentContainerStyle } from "@/utils/styles";

export default function StartBeepingScreen() {
  const trpc = useTRPC();
  const { user } = useUser();

  const {
    data,
    refetch,
    isRefetching,
  } = useQuery(
    trpc.beeper.queue.queryOptions(undefined, {
      enabled: user && user.isBeeping,
    }),
  );

  const [currentBeep, ...queue] = data ?? [];

  return (
    <FlatList
      data={queue}
      keyExtractor={(beep) => beep.id}
      renderItem={({ item, index }) => <QueueItem item={item} index={index} />}
      onRefresh={refetch}
      refreshing={isRefetching}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={getContentContainerStyle(queue.length === 0)}
      ListEmptyComponent={
        <View style={{ gap: 8, alignItems: 'center' }}>
          <Text size="5xl">⏳</Text>
          <Text weight="800" size="lg">
            Your queue is empty!
          </Text>
          <Text style={{ textAlign: "center", maxWidth: "80%" }}>
            If additional riders join your queue, they will show up here!
          </Text>
        </View>
      }
    />
  );
}

