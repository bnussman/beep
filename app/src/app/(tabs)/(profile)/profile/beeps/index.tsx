import { useLayoutEffect, useState } from "react";
import { Text } from "@/components/Text";
import { useUser } from "@/utils/useUser";
import { Beep } from "@/components/Beep";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { ActivityIndicator, FlatList, View } from "react-native";
import { getContentContainerStyle } from "@/utils/styles";
import { PAGE_SIZE } from "@/utils/constants";
import { useNavigation } from "expo-router/react-navigation";
import { Menu, Option } from "@/components/Menu";
import { capitalize } from "@/utils/strings";
import { getNativeNavigationMenuItem } from "@/components/Menu.utils";
import { Elipsis } from "@/components/Elipsis";
import { Button } from "heroui-native";
import { RouterOutputs } from "../../../../../../../api/src";
import { orpc } from "@/utils/orpc";

const beepStatuses: BeepStatus[] = [
  "canceled",
  "denied",
  "waiting",
  "accepted",
  "on_the_way",
  "here",
  "in_progress",
  "complete",
];

type BeepStatus = RouterOutputs['beep']['beep']['status'];

export default function BeepsScreen() {
  const { user } = useUser();
  const navigation = useNavigation();

  const [statuses, setStatuses] = useState<BeepStatus[]>(['complete']);

  const options: Option[] = beepStatuses.map((status) => {
    const checked = statuses.includes(status);

    return {
      title: capitalize(status.replaceAll('_', ' ')),
      checked,
      onClick: () => setStatuses((prev) => {
        if (checked) {
          return prev.filter(s => s !== status)
        }
        return [...prev, status];
      })
    };
  });

  const nativeOptions: Option[] = [
    {
      title: "Status",
      options,
    }
  ];

  useLayoutEffect(() => {
    navigation.setOptions({
      unstable_headerRightItems: () => ([
        {
          type: "menu",
          label: "Filter beeps by status",
          icon: { name: "line.3.horizontal.decrease", type: "sfSymbol" },
          menu: {
            title: "Filter",
            multiselectable: true,
            items: nativeOptions.map(getNativeNavigationMenuItem)
          },
        },
      ]),
      headerRight: () => (
        <Menu
          trigger={({ onPress }) => (
            <Button variant="ghost" onPress={onPress}>
              <Elipsis />
            </Button>
          )}
          options={nativeOptions}
        />
      )
    });
  }, [options, nativeOptions]);

  const {
    data,
    isLoading,
    error,
    refetch,
    isRefetching,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    orpc.beep.beeps.infiniteOptions({
      input: (page: number) => ({
        userId: user?.id,
        pageSize: PAGE_SIZE,
        status: statuses,
        page,
      }),
      initialPageParam: 1,
      placeholderData: keepPreviousData,
      getNextPageParam(page) {
        if (page.page === page.pages) {
          return undefined;
        }
        return page.page + 1;
      },
      refetchOnMount: false,
    }),
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
      contentContainerStyle={{ ...getContentContainerStyle(beeps?.length === 0), padding: 16 }}
      renderItem={(data) => <Beep {...data} />}
      keyExtractor={(beep) => beep.id}
      onEndReached={() => {
        if (!isFetchingNextPage) {
          fetchNextPage();
        }
      }}
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
