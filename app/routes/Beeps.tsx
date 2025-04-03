import React from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View,
} from "react-native";
import { Text } from "@/components/Text";
import { useUser } from "../utils/useUser";
import { Beep } from "../components/Beep";
import { PAGE_SIZE } from "../utils/constants";
import { trpc } from "@/utils/trpc";

export function BeepsScreen() {
  const { user } = useUser();

  const {
    data,
    isLoading,
    error,
    refetch,
    isRefetching,
    fetchNextPage,
    isFetchingNextPage,
  } = trpc.beep.beeps.useInfiniteQuery(
    {
      userId: user?.id,
      pageSize: PAGE_SIZE
    },
    {
      initialCursor: 1,
      getNextPageParam(page) {
        if (page.page === page.pages) {
          return undefined;
        }
        return page.page + 1;
      }
    }
  );

  const beeps = data?.pages.flatMap((page) => page.beeps);

  const renderFooter = () => {
    if (isFetchingNextPage) {
      return (
        <View className="flex items-center justify-center p-4">
          <ActivityIndicator />
        </View>
      );
    }

    return null;
  };

  if (isLoading) {
    return (
      <View className="h-full items-center justify-center">
        <ActivityIndicator size="large" />
      </View >
    );
  }

  if (error) {
    return (
      <View className="h-full items-center justify-center">
        <Text>{error.message}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={beeps}
      className="p-2"
      contentContainerClassName={beeps?.length === 0 ? "flex-1 items-center justify-center" : "gap-2"}
      renderItem={(data) => <Beep {...data} />}
      keyExtractor={(beep) => beep.id}
      onEndReached={() => fetchNextPage()}
      onEndReachedThreshold={0.1}
      ListFooterComponent={renderFooter()}
      ListEmptyComponent={
        <View className="items-center">
          <Text size="3xl" weight="black">
            No Beeps
          </Text>
          <Text>You have no previous beeps to display</Text>
        </View>
      }
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
      }
    />
  );
}
