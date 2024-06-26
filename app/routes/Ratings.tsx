import React from "react";
import {
  FlatList,
  RefreshControl,
  View,
  ActivityIndicator,
} from "react-native";
import { useUser } from "../utils/useUser";
import { useQuery } from "@apollo/client";
import { Rating } from "../components/Rating";
import { PAGE_SIZE } from "../utils/constants";
import { graphql } from "gql.tada";
import { Text } from "@/components/Text";

export const Ratings = graphql(`
  query GetRatings($id: String, $offset: Int, $show: Int) {
    getRatings(id: $id, offset: $offset, show: $show) {
      items {
        id
        stars
        timestamp
        message
        rater {
          id
          name
          photo
        }
        rated {
          id
          name
          photo
        }
        beep {
          id
        }
      }
      count
    }
  }
`);

export function RatingsScreen() {
  const { user } = useUser();

  const { data, loading, error, fetchMore, refetch } = useQuery(Ratings, {
    variables: { id: user?.id, offset: 0, show: PAGE_SIZE },
    notifyOnNetworkStatusChange: true,
  });

  const ratings = data?.getRatings.items;
  const count = data?.getRatings.count || 0;
  const isRefreshing = Boolean(data) && loading;
  const canLoadMore = ratings && count && ratings?.length < count;

  const getMore = () => {
    if (!canLoadMore || isRefreshing) return;

    fetchMore({
      variables: {
        offset: ratings?.length || 0,
        limit: PAGE_SIZE,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return prev;
        }

        return {
          getRatings: {
            items: [
              ...prev.getRatings.items,
              ...fetchMoreResult.getRatings.items,
            ],
            count: fetchMoreResult.getRatings.count,
          },
        };
      },
    });
  };

  const renderFooter = () => {
    if (!isRefreshing) return null;

    if (!count || count < PAGE_SIZE) return null;

    return (
      <View className="flex items-center p-4">
        <ActivityIndicator />
      </View>
    );
  };

  if (loading && !ratings) {
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
      onEndReached={getMore}
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
        <RefreshControl refreshing={isRefreshing} onRefresh={refetch} />
      }
    />
  );
}
