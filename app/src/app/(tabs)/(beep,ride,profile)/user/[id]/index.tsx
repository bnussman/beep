import * as Haptics from 'expo-haptics';
import { ActivityIndicator, FlatList, SafeAreaView, View } from "react-native";
import { Text } from "@/components/Text";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { orpc } from "@/utils/orpc";
import { useState } from "react";
import { UserDetails } from "@/components/user/Details";
import { UserHeader } from "@/components/user/Header";
import { PAGE_SIZE } from "@/utils/constants";
import { UserRating } from "@/components/user/Ratings";

export default function User() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const {
    data: user,
    isLoading: userPending,
    isRefetching: isUserRefetching,
    error: userError,
    refetch: refetchUser,
  } = useQuery(orpc.user.publicUser.queryOptions({ input: id }));

  const {
    data,
    fetchNextPage,
    refetch: refetchRatings,
    isFetchingNextPage,
    isRefetching: isRefetchingRatings,
  } = useInfiniteQuery(
    orpc.rating.ratings.infiniteOptions({
      input: (page) => ({
        ratedId: id,
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
      enabled: selectedIndex === 1
    })
  );

  if (userPending) {
    return (
      <View
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  if (userError) {
    return (
      <View
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Text size="xl" weight="800">
          Error
        </Text>
        <Text>{userError.message}</Text>
      </View>
    );
  }

  return (
    <FlatList
      contentInsetAdjustmentBehavior="automatic"
      ListHeaderComponent={
        <View style={{ gap: 8 }}>
          <UserHeader
            userId={id}
            index={selectedIndex}
            onTabChange={(index) => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSelectedIndex(index);
            }}
          />
          {selectedIndex === 0 && <UserDetails userId={id} />}
        </View>
      }
      contentContainerStyle={{ paddingHorizontal: 12, gap: 8 }}
      onRefresh={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        refetchUser();
        if (selectedIndex === 1) {
          refetchRatings();
        }
      }}
      data={(() => {
        if (selectedIndex === 0) {
          return [];
        }
        if (selectedIndex === 1) {
          return data?.pages.flatMap((ratings) => ratings.ratings);
        }
        return [];
      })()}
      renderItem={(() => {
        if (selectedIndex === 0) {
          return () => <></>;
        }
        if (selectedIndex === 1) {
          return ({ item }) => <UserRating rating={item} />;
        }
        return () => <></>;
      })()}
      refreshing={(() => {
        if (selectedIndex === 1) {
          return isUserRefetching || isRefetchingRatings;
        }
        return isUserRefetching;
      })()}
      onEndReached={() => {
        if (selectedIndex === 1) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.1}
      ListFooterComponentStyle={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
      ListFooterComponent={() => {
        if (isFetchingNextPage) {
          return <ActivityIndicator />;
        }
        return null;
      }}
    />
  );
}
