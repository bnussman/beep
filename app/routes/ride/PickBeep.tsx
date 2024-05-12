import React, { useEffect } from "react";
import { StaticScreenProps, useNavigation } from "@react-navigation/native";
import { ApolloError, useMutation, useQuery } from "@apollo/client";
import { printStars } from "../../components/Stars";
import { Unpacked } from "../../utils/constants";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View,
} from "react-native";
import { Avatar } from "@/components/Avatar";
import { useLocation } from "@/utils/useLocation";
import { client } from "@/utils/apollo";
import { InitialRiderStatus } from "./FindBeep";
import { ResultOf, VariablesOf, graphql } from "gql.tada";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";

const GetBeepers = graphql(`
  query GetBeepers($latitude: Float!, $longitude: Float!, $radius: Float) {
    getBeepers(latitude: $latitude, longitude: $longitude, radius: $radius) {
      id
      name
      first
      isStudent
      singlesRate
      groupRate
      capacity
      queueSize
      photo
      role
      rating
      venmo
      cashapp
      payments {
        id
        productId
      }
    }
  }
`);

export const ChooseBeep = graphql(`
  mutation ChooseBeep(
    $beeperId: String!
    $origin: String!
    $destination: String!
    $groupSize: Float!
  ) {
    chooseBeep(
      beeperId: $beeperId
      input: {
        origin: $origin
        destination: $destination
        groupSize: $groupSize
      }
    ) {
      id
      position
      origin
      destination
      status
      groupSize
      beeper {
        id
        first
        name
        singlesRate
        groupRate
        isStudent
        role
        venmo
        cashapp
        username
        phone
        photo
        capacity
        queueSize
        location {
          longitude
          latitude
        }
        cars {
          id
          photo
          make
          color
          model
        }
      }
    }
  }
`);

type Props = StaticScreenProps<
  Omit<VariablesOf<typeof ChooseBeep>, "beeperId">
>;

export function PickBeepScreen({ route }: Props) {
  const { location } = useLocation();
  const navigation = useNavigation();

  const { data, loading, error, refetch } = useQuery(GetBeepers, {
    variables: {
      latitude: location?.coords.latitude ?? 0,
      longitude: location?.coords.longitude ?? 0,
      radius: 20,
    },
    skip: !location,
    notifyOnNetworkStatusChange: true,
  });

  const [getBeep, { loading: isPickBeeperLoading }] = useMutation(ChooseBeep);

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
      const { data } = await getBeep({
        variables: {
          ...route.params,
          beeperId,
        },
      });

      if (data) {
        client.writeQuery({
          query: InitialRiderStatus,
          data: { getRiderStatus: { ...data.chooseBeep } },
        });
        navigation.goBack();
      }
    } catch (error) {
      alert((error as ApolloError).message);
    }
  };

  const beepers = data?.getBeepers;
  const isRefreshing = Boolean(data) && loading;

  const renderItem = ({
    item,
  }: {
    item: Unpacked<ResultOf<typeof GetBeepers>["getBeepers"]>;
    index: number;
  }) => {
    const isPremium =
      item.payments?.some((p) =>
        p.productId.startsWith("top_of_beeper_list"),
      ) ?? false;

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
              {item.name}
            </Text>
            {item.rating && <Text size="xs">{printStars(item.rating)}</Text>}
          </View>
          {isPremium && (
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

  if ((!data && loading) || location === undefined) {
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
          : undefined
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
