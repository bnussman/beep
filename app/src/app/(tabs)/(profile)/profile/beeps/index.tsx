import React from "react";
import { Text } from "@/components/Text";
import { useUser } from "@/utils/useUser";
import { Beep } from "@/components/Beep";
import { useTRPC } from "@/utils/trpc";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ActivityIndicator, FlatList, View } from "react-native";
import { getContentContainerStyle } from "@/utils/styles";
import { PAGE_SIZE } from "@/utils/constants";

export default function BeepsScreen() {
  const trpc = useTRPC();
  const { user } = useUser();

  const {
    data,
    isLoading,
    error,
    refetch,
    isRefetching,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    trpc.beep.beeps.infiniteQueryOptions(
      {
        userId: user?.id,
        pageSize: PAGE_SIZE,
      },
      {
        initialCursor: 1,
        getNextPageParam(page) {
          if (page.page === page.pages) {
            return undefined;
          }
          return page.page + 1;
        },
      },
    ),
  );

  const beeps = data?.pages.flatMap((page) => page.beeps);

  const renderFooter = () => {
    if (isFetchingNextPage) {
      return (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <ActivityIndicator />
        </View>
      );
    }

    return null;
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text size="3xl" weight="800">
          Error
        </Text>
        <Text>{error.message}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={beeps}
      contentContainerStyle={getContentContainerStyle(beeps?.length === 0)}
      renderItem={(data) => <Beep {...data} />}
      keyExtractor={(beep) => beep.id}
      onEndReached={() => fetchNextPage()}
      onEndReachedThreshold={0.1}
      ListFooterComponent={renderFooter()}
      contentInsetAdjustmentBehavior="automatic"
      ListEmptyComponent={
        <View style={{ alignItems: "center" }}>
          <Text size="3xl" weight="800">
            No Beeps
          </Text>
          <Text>You have no previous beeps to display</Text>
        </View>
      }
      refreshing={isRefetching}
      onRefresh={refetch}
    />
  );
}
