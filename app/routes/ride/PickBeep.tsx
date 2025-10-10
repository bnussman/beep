import React, { useEffect } from "react";
import { StaticScreenProps, useNavigation } from "@react-navigation/native";
import { printStars } from "../../components/Stars";
import { Avatar } from "@/components/Avatar";
import { useLocation } from "@/utils/location";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { RouterInput, RouterOutput, useTRPC } from "@/utils/trpc";
import { ActivityIndicator, FlatList, View } from "react-native";

import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { isIOS } from "@/utils/constants";

type Props = StaticScreenProps<{
  origin: string;
  destination: string;
  groupSize: string;
}>;

export function PickBeepScreen({ route }: Props) {
  const trpc = useTRPC();
  const { location } = useLocation();
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const {
    data: beepers,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery(
    trpc.rider.beepers.queryOptions(
      {
        latitude: location?.coords.latitude ?? 0,
        longitude: location?.coords.longitude ?? 0,
      },
      {
        enabled: location !== undefined,
      },
    ),
  );

  const { mutate: startBeep, isPending: isPickBeeperLoading } = useMutation(
    trpc.rider.startBeep.mutationOptions({
      onSuccess(data) {
        queryClient.setQueryData(trpc.rider.currentRide.queryKey(), data);
        navigation.goBack();
      },
      onError(error) {
        alert(error.message);
      },
    }),
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        isPickBeeperLoading ? (
          <ActivityIndicator style={isIOS ? { marginLeft: 8 } : null} />
        ) : null,
    });
  }, [isPickBeeperLoading]);

  const chooseBeep = async (beeperId: string) => {
    if (isPickBeeperLoading) {
      // We don't want to make API requests if a request is inflight
      return;
    }

    startBeep({
      beeperId,
      ...route.params,
      groupSize: Number(route.params.groupSize),
      ...(location && {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }),
    });
  };

  const renderItem = ({
    item,
  }: {
    item: RouterOutput["rider"]["beepers"][number];
    index: number;
  }) => {
    return (
      <Card onPress={() => chooseBeep(item.id)} pressable>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text size="xl" weight="800">
              {item.first} {item.last}
            </Text>
            {item.rating && (
              <Text size="xs">{printStars(Number(item.rating))}</Text>
            )}
          </View>
          {item.isPremium && (
            <Text
              size="lg"
              style={{
                shadowRadius: 10,
                shadowColor: "#f5db73",
                shadowOpacity: 1,
                opacity: 1,
                marginRight: 16,
              }}
            >
              👑
            </Text>
          )}
          <Avatar size="sm" src={item.photo ?? undefined} />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text weight="bold">💵 Rates</Text>
          <Text>
            ${item.singlesRate} singles / ${item.groupRate} groups
          </Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text weight="bold">🚙 Rider Capacity</Text>
          <Text>
            {item.capacity} rider{item.queueSize === 1 ? "" : "s"}
          </Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text weight="bold">⏲️ Queue Length</Text>
          <Text>
            {item.queueSize} rider{item.queueSize === 1 ? "" : "s"}
          </Text>
        </View>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!location) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text weight="800">Loading Location</Text>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text weight="800">Error</Text>
        <Text>{error.message}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={beepers}
      renderItem={renderItem}
      keyExtractor={(beeper) => beeper.id}
      refreshing={isRefetching}
      onRefresh={refetch}
      contentContainerStyle={
        beepers?.length === 0
          ? { flex: 1, alignItems: "center", justifyContent: "center" }
          : { padding: 10, gap: 8 }
      }
      ListEmptyComponent={
        <View style={{ alignItems: "center" }}>
          <Text weight="800" size="2xl">
            Nobody is beeping
          </Text>
          <Text>There are no drivers within 20 miles of you</Text>
        </View>
      }
    />
  );
}
