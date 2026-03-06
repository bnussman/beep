import React from "react";
import { FlatList, View, ActivityIndicator } from "react-native";
import { useUser } from "@/utils/useUser";
import { Rating } from "@/components/Rating";
import { isIOS, PAGE_SIZE } from "@/utils/constants";
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
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <Text weight="800" size="3xl">
          Error
        </Text>
        <Text>{error.message}</Text>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={
        ratings?.length === 0 ? {
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...(isIOS && ({
            flex: undefined,
            height: '75%'
          }))
        } : {
          paddingHorizontal: 16,
          gap: 8
        }
      }
      contentInsetAdjustmentBehavior="automatic"
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
