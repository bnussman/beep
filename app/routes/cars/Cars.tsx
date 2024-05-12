import React, { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { ApolloError, useMutation, useQuery } from "@apollo/client";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
} from "react-native";
import { PAGE_SIZE } from "@/utils/constants";
import { useUser } from "@/utils/useUser";
import { Image } from "@/components/Image";
import { View } from "react-native";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { cache } from "@/utils/apollo";
import { graphql } from "gql.tada";
import * as ContextMenu from "zeego/context-menu";

export const DeleteCar = graphql(`
  mutation DeleteCar($id: String!) {
    deleteCar(id: $id)
  }
`);

export const EditCar = graphql(`
  mutation EditCar($default: Boolean!, $id: String!) {
    editCar(default: $default, id: $id) {
      id
      default
    }
  }
`);

export const CarsQuery = graphql(`
  query GetCars($id: String, $offset: Int, $show: Int) {
    getCars(id: $id, offset: $offset, show: $show) {
      items {
        id
        make
        model
        year
        color
        photo
        default
      }
      count
    }
  }
`);

export function Cars() {
  const navigation = useNavigation();
  const { user } = useUser();

  const { data, loading, error, refetch, fetchMore } = useQuery(CarsQuery, {
    variables: { id: user?.id, offset: 0, show: PAGE_SIZE },
    notifyOnNetworkStatusChange: true,
  });

  const [deleteCar] = useMutation(DeleteCar);

  const [editCar] = useMutation(EditCar);

  const cars = data?.getCars.items;
  const count = data?.getCars.count ?? 0;
  const isRefreshing = Boolean(data) && loading;
  const canLoadMore = cars && count && cars?.length < count;

  const getMore = () => {
    if (!canLoadMore || isRefreshing) return;

    fetchMore({
      variables: {
        offset: cars?.length ?? 0,
        limit: PAGE_SIZE,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return prev;
        }

        return {
          getCars: {
            items: [...prev.getCars.items, ...fetchMoreResult.getCars.items],
            count: fetchMoreResult.getCars.count,
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

  const onDelete = (id: string) => {
    deleteCar({
      variables: { id },
      update: (cache) => {
        cache.evict({
          id: cache.identify({
            __typename: "Car",
            id,
          }),
        });
      },
    }).catch((error: ApolloError) => alert(error?.message));
  };

  const setDefault = (id: string) => {
    const oldDefaultId = cars?.find((car) => car.default)?.id;

    editCar({ variables: { id, default: true } }).then(() => {
      if (oldDefaultId) {
        cache.modify({
          id: cache.identify({
            __typename: "Car",
            id: oldDefaultId,
          }),
          fields: {
            default() {
              return false;
            },
          },
        });
      }
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <Pressable
            className="pr-3"
            onPress={() => navigation.navigate("Add Car")}
            aria-label="Add a car"
          >
            <Text>➕</Text>
          </Pressable>
        );
      },
    });
  }, [navigation]);

  if (!data && loading) {
    return (
      <View className="h-full flex items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View className="h-full flex items-center justify-center">
        <Text>{error.message}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={cars}
      contentContainerClassName="h-full p-3 gap-2"
      renderItem={({ item: car }) => (
        <ContextMenu.Root>
          <ContextMenu.Trigger action="press">
            <Card
              pressable
              variant="outlined"
              className="p-4 gap-4 flex flex-row items-center justify-between"
            >
              <View className="gap-2 flex-shrink">
                <Text weight="bold" className="capitalize flex-wrap">
                  {car.color} {car.make} {car.model} {car.year}
                </Text>
                <View className="flex flex-row flex-wrap gap-2">
                  {car.default && (
                    <Card className="px-2 py-1 !bg-neutral-500">
                      <Text size="xs" weight="black" className="color-white">
                        Default
                      </Text>
                    </Card>
                  )}
                </View>
              </View>
              <Image
                className="rounded-lg w-32 h-20"
                source={{ uri: car.photo }}
                alt={`car-${car.id}`}
              />
            </Card>
          </ContextMenu.Trigger>
          <ContextMenu.Content>
            <ContextMenu.Item
              key="make-default"
              onSelect={() => setDefault(car.id)}
            >
              <ContextMenu.ItemTitle>Make Default</ContextMenu.ItemTitle>
            </ContextMenu.Item>
            <ContextMenu.Item
              key="delete-car"
              onSelect={() => onDelete(car.id)}
              destructive
            >
              <ContextMenu.ItemTitle>Delete Car</ContextMenu.ItemTitle>
            </ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu.Root>
      )}
      keyExtractor={(car) => car.id}
      contentContainerStyle={
        cars?.length === 0
          ? { flex: 1, alignItems: "center", justifyContent: "center" }
          : undefined
      }
      ListEmptyComponent={
        <>
          <Text weight="black" key="title">
            No Cars
          </Text>
          <Text key="message">You have no cars on your account!</Text>
        </>
      }
      onEndReached={getMore}
      onEndReachedThreshold={0.1}
      ListFooterComponent={renderFooter()}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={refetch} />
      }
    />
  );
}
