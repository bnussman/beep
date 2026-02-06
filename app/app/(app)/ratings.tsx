import React from "react";
import { FlatList, View, ActivityIndicator } from "react-native";
import { useUser } from "../../utils/useUser";
import { Rating } from "../../components/Rating";
import { PAGE_SIZE } from "../../utils/constants";
import { Text } from "@/components/Text";
import { useTRPC } from "@/utils/trpc";
import { useInfiniteQuery } from "@tanstack/react-query";

export default function RatingsScreen() {
  const trpc = useTRPC();
  const { user } = useUser();

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    refetch,
    isFetchingNextPage,
    isRefetching,
  } = useInfiniteQuery(trpc.rating.ratings.infiniteQueryOptions(
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
  ));

  const ratings = data?.pages.flatMap((ratings) => ratings.ratings);

  const renderFooter = () => {
    if (isFetchingNextPage) {
      return (
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <ActivityIndicator />
        </View>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <Text>{error.message}</Text>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={
        ratings?.length === 0 ? {
          display: 'flex',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        } : {
          padding: 8,
          gap: 8,
        }
      }
      data={ratings}
      renderItem={(data) => <Rating {...data} />}
      keyExtractor={(rating) => rating.id}
      onEndReached={() => fetchNextPage()}
      onEndReachedThreshold={0.1}
      ListFooterComponent={renderFooter()}
      ListEmptyComponent={
        <View style={{ display: 'flex', alignItems: 'center' }}>
          <Text weight="800" size="3xl">
            No Ratings
          </Text>
          <Text>You have no ratings to display</Text>
        </View>
      }
      refreshing={isRefetching}
      onRefresh={refetch}
    />
  );
}
