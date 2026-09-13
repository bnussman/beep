import { FlatList, View, ActivityIndicator } from "react-native";
import { useUser } from "@/utils/useUser";
import { Rating } from "@/components/Rating";
import { PAGE_SIZE } from "@/utils/constants";
import { Text } from "@/components/Text";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getContentContainerStyle } from "@/utils/styles";
import { orpc } from "@/utils/orpc";
import { Card } from "../Card";
import { Avatar } from "../Avatar";
import { printStars } from "../Stars";

interface Props {
  userId: string;
}

export default function UserRatings(props: Props) {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    refetch,
    isFetchingNextPage,
    isRefetching,
  } = useInfiniteQuery(
    orpc.rating.ratings.infiniteOptions({
      input: (page) => ({
        ratedId: props.userId,
        pageSize: PAGE_SIZE,
        page
      }),
      initialPageParam: 1,
      getNextPageParam(page) {
        if (page.page === page.pages) {
          return undefined;
        }
        return page.page + 1;
      },
    })
  );

  const ratings = data?.pages.flatMap((ratings) => ratings.ratings);

  const renderFooter = () => {
    if (isFetchingNextPage) {
      return (
        <View
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
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
      <View
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <Text weight="800" size="3xl">
          Error
        </Text>
        <Text>{error.message}</Text>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={{
        ...getContentContainerStyle(ratings?.length === 0),
        paddingHorizontal: 0,
        flexGrow: 1,
      }}
      contentInsetAdjustmentBehavior="automatic"
      data={ratings}
      renderItem={({ item: rating }) => (
        <Card style={{ padding: 16, gap: 16, display: "flex" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                flex: 1,
              }}
            >
              <Avatar size="xs" src={rating.rater.photo ?? undefined} />
              <View style={{ flexShrink: 1 }}>
                <Text weight="bold">
                  {rating.rater.first} {rating.rater.last}
                </Text>
                <Text color="subtle" size="xs">
                  {rating.timestamp.toLocaleString(undefined, {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </Text>
              </View>
            </View>
            <Text>{printStars(rating.stars)}</Text>
          </View>
          {rating.message && <Text>{rating.message}</Text>}
        </Card>
      )}
      keyExtractor={(rating) => rating.id}
      onEndReached={() => fetchNextPage()}
      onEndReachedThreshold={0.1}
      ListFooterComponent={renderFooter()}
      ListEmptyComponent={
        <View style={{ display: "flex", alignItems: "center" }}>
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
