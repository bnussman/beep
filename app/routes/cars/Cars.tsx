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
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}>
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
            onPress={() => navigation.navigate("Add Car")}
            aria-label="Add a car"
            style={{ paddingRight: 12 }}
          >
            <Text size="3xl">➕</Text>
          </Pressable>
        );
      },
    });
  }, [navigation]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>{error.message}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={cars}
      contentContainerStyle={{ flex: 1, padding: 12, gap: 8 }}
      renderItem={({ item: car }) => (
        <ContextMenu.Root>
          <ContextMenu.Trigger>
            <Card
              pressable
              style={{ padding: 16, gap: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <View style={{ gap: 8, flexShrink: 1 }}>
                <Text weight="bold" style={{ textTransform: 'capitalize', flexWrap: 'wrap' }}>
                  {car.color} {car.make} {car.model} {car.year}
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {car.default && (
                    <Card style={{ paddingHorizontal: 8, paddingVertical: 4, backgroundColor: '#737373' }}>
                      <Text size="xs" weight="800" style={{ color: 'white' }}>
                        Default
                      </Text>
                    </Card>
                  )}
                </View>
              </View>
              <Image
                style={{ borderRadius: 12, width: 128, height: 80 }}
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
