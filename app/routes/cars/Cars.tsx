import React, { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
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
import * as ContextMenu from "zeego/context-menu";
import { trpc } from "@/utils/trpc";
import { TRPCClientError } from "@trpc/client";

export function Cars() {
  const navigation = useNavigation();
  const { user } = useUser();

  const utils = trpc.useUtils();
  const {
    data,
    isLoading,
    error,
    refetch,
    isFetchingNextPage,
    fetchNextPage,
    isRefetching,
  } = trpc.car.cars.useInfiniteQuery(
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
  );

  const { mutateAsync: deleteCar } = trpc.car.deleteCar.useMutation({
    onSuccess() {
      utils.car.cars.invalidate();
    },
  });

  const { mutateAsync: updateCar } = trpc.car.updateCar.useMutation({
    onMutate(vars) {
      utils.car.cars.setInfiniteData(
        { userId: user?.id, pageSize: PAGE_SIZE },
        (oldData) => {
          if (!oldData) {
            return undefined;
          }

          for (const page of oldData.pages) {
            for (const car of page.cars) {
              car.default = car.id === vars.carId;
            }
          }

          return oldData;
        },
      );
    },
  });

  const cars = data?.pages.flatMap((page) => page.cars);

  const renderFooter = () => {
    if (isFetchingNextPage) {
      return (
        <View className="flex items-center p-4">
          <ActivityIndicator />
        </View>
      );
    }

    return null;
  };

  const onDelete = (id: string) => {
    deleteCar({ carId: id }).catch((error: TRPCClientError<any>) =>
      alert(error?.message),
    );
  };

  const setDefault = (id: string) => {
    updateCar({
      carId: id,
      data: { default: true },
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
            <Text size="3xl">➕</Text>
          </Pressable>
        );
      },
    });
  }, [navigation]);

  if (isLoading) {
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
          <ContextMenu.Trigger>
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
                      <Text size="xs" weight="800" className="color-white">
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
        <View style={{ alignItems: 'center' }}>
          <Text weight="800" key="title" size="3xl">
            No Cars
          </Text>
          <Text key="message">You have no cars on your account!</Text>
        </View>
      }
      onEndReached={() => fetchNextPage()}
      onEndReachedThreshold={0.1}
      ListFooterComponent={renderFooter()}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
      }
    />
  );
}
