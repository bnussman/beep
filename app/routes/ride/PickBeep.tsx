import React, { useEffect } from "react";
import { StaticScreenProps, useNavigation } from "@react-navigation/native";
import { ApolloError, useMutation, useQuery } from "@apollo/client";
import { printStars } from "../../components/Stars";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View,
} from "react-native";
import { Avatar } from "@/components/Avatar";
import { useLocation } from "@/utils/useLocation";
import { InitialRiderStatus } from "./FindBeep";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { RouterInput, RouterOutput, trpc } from "@/utils/trpc";

type Props = StaticScreenProps<
  Omit<RouterInput['rider']['startBeep'], "beeperId">
>;

export function PickBeepScreen({ route }: Props) {
  const { location } = useLocation();
  const navigation = useNavigation();

  const { data: beepers, isLoading, error, refetch } = trpc.rider.beepers.useQuery(
    {
      latitude: location?.coords.latitude ?? 0,
      longitude: location?.coords.longitude ?? 0,
    },
    {
      enabled: location !== undefined
    }
  );

  const {
    mutateAsync: startBeep,
    isPending: isPickBeeperLoading
  } = trpc.rider.startBeep.useMutation();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (isPickBeeperLoading ? <ActivityIndicator /> : null),
    });
  }, [isPickBeeperLoading]);

  const chooseBeep = async (beeperId: string) => {
    if (isPickBeeperLoading) {
      return;
    }
    try {
      const data = await startBeep({
        ...route.params,
        beeperId,
      });

      // @todo write rider's beep to cache

      navigation.goBack();
    } catch (error) {
      alert((error as ApolloError).message);
    }
  };

  const isRefreshing = Boolean(beepers) && isLoading;

  const renderItem = ({
    item,
  }: {
    item: RouterOutput['rider']['beepers'][number];
    index: number;
  }) => {
    return (
      <Card
        className="p-4"
        onPress={() => chooseBeep(item.id)}
        pressable
        variant="outlined"
      >
        <View className="flex flex-row items-center mb-4">
          <View className="flex-grow flex-wrap">
            <Text size="2xl" weight="black">
              {item.first} {item.last}
            </Text>
            {item.rating && <Text size="xs">{printStars(Number(item.rating))}</Text>}
          </View>
          {item.isPremium && (
            <Text
              size="lg"
              className="shadow-xl opacity-100 shadow-yellow-400 mr-4"
              style={{
                shadowRadius: 10,
                shadowColor: "#f5db73",
                shadowOpacity: 1,
              }}
            >
              👑
            </Text>
          )}
          <Avatar size="sm" src={item.photo ?? undefined} />
        </View>
        <View className="flex flex-row justify-between">
          <Text weight="bold">💵 Rates</Text>
          <Text>
            ${item.singlesRate} singles / ${item.groupRate} groups
          </Text>
        </View>
        <View className="flex flex-row justify-between">
          <Text weight="bold">🚙 Rider Capacity</Text>
          <Text>
            {item.capacity} rider{item.queueSize === 1 ? "" : "s"}
          </Text>
        </View>
        <View className="flex flex-row justify-between">
          <Text weight="bold">⏲️ Queue Length</Text>
          <Text>
            {item.queueSize} rider{item.queueSize === 1 ? "" : "s"}
          </Text>
        </View>
      </Card>
    );
  };

  if ((!beepers && isLoading) || location === undefined) {
    return (
      <View className="flex items-center justify-center h-full">
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex items-center justify-center h-full">
        <Text weight="black">Error</Text>
        <Text>{error.message}</Text>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerClassName="p-3"
      data={beepers}
      renderItem={renderItem}
      keyExtractor={(beeper) => beeper.id}
      contentContainerStyle={
        beepers?.length === 0
          ? { flex: 1, alignItems: "center", justifyContent: "center" }
          : { gap: 8 }
      }
      ListEmptyComponent={
        <>
          <Text weight="black" size="2xl" key="title">
            Nobody is beeping
          </Text>
          <Text key="message">There are no drivers within 20 miles of you</Text>
        </>
      }
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={refetch} />
      }
    />
  );
}
