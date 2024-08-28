import React from "react";
import {
  FlatList,
  RefreshControl,
  View,
  ActivityIndicator,
} from "react-native";
import { useUser } from "../utils/useUser";
import { Rating } from "../components/Rating";
import { PAGE_SIZE } from "../utils/constants";
import { Text } from "@/components/Text";
import { trpc } from "@/utils/trpc";

export function RatingsScreen() {
  const { user } = useUser();

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    refetch,
    isFetchingNextPage,
    isRefetching,
  } = trpc.rating.ratings.useInfiniteQuery(
    {
      userId: user?.id,
      show: PAGE_SIZE
    },
    {
      initialCursor: 0,
      getNextPageParam: (lastPage, allPages) => {
        const numberOfRatingsLoaded = allPages.reduce((acc, page) => acc += page.ratings.length, 0);
        if (numberOfRatingsLoaded === lastPage.count) {
          return undefined;
        }
        return numberOfRatingsLoaded;
      }
    }
  );

  const ratings = data?.pages.flatMap((ratings) => ratings.ratings);
  const count = data?.pages[0]?.count ?? 0;

  const renderFooter = () => {
    if (isFetchingNextPage) {
      return (
        <View className="flex items-center p-4">
          <ActivityIndicator />
        </View>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <View className="h-full items-center justify-center">
        <ActivityIndicator />
      </View>
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
      className="p-2"
      contentContainerClassName={ratings?.length === 0 ? "flex-1 items-center justify-center" : "gap-2"}
      data={ratings}
      renderItem={(data) => <Rating {...data} />}
      keyExtractor={(rating) => rating.id}
      onEndReached={() => fetchNextPage()}
      onEndReachedThreshold={0.1}
      ListFooterComponent={renderFooter()}
      ListEmptyComponent={
        <View className="items-center">
        <Text weight="black" size="3xl">
          No Ratings
        </Text>
        <Text>You have no ratings to display</Text>
        </View>
      }
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
      }
    />
  );
}
