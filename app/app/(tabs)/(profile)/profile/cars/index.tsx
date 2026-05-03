import React from "react";
import { ActivityIndicator, FlatList } from "react-native";
import { PAGE_SIZE } from "@/utils/constants";
import { useUser } from "@/utils/useUser";
import { Image } from "@/components/Image";
import { View } from "react-native";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { useTRPC } from "@/utils/trpc";
import { TRPCClientError } from "@trpc/client";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { Menu } from "@/components/Menu";
import { Stack, useRouter } from "expo-router";
import { getContentContainerStyle } from "@/utils/styles";

const colorMap = {
  red: "#ca3f3f",
  green: "#62be62",
  blue: "#4285ea",
  purple: "#a837b7",
  black: "#2b2b2b",
  gray: "#a8a8a8",
  pink: "#d36ecb",
  white: "#e2e2e2",
  orange: "#d8670a",
  tan: "#c69567",
  brown: "#78513edd",
  silver: "#7e7e7e",
  yellow: "#ffc72f",
};

export default function Cars() {
  const trpc = useTRPC();
  const router = useRouter();
  const { user } = useUser();

  const queryClient = useQueryClient();
  const {
    data,
    isLoading,
    error,
    refetch,
    isFetchingNextPage,
    fetchNextPage,
    isRefetching,
  } = useInfiniteQuery(
    trpc.car.cars.infiniteQueryOptions(
      {
        userId: user?.id,
        pageSize: PAGE_SIZE,
      },
      {
        placeholderData: keepPreviousData,
        initialCursor: 1,
        getNextPageParam(page) {
          if (page.page === page.pages) {
            return undefined;
          }
          return page.page + 1;
        },
      },
    ),
  );

  const { mutateAsync: deleteCar } = useMutation(
    trpc.car.deleteCar.mutationOptions({
      onSuccess() {
        queryClient.invalidateQueries(trpc.car.cars.pathFilter());
      },
    }),
  );

  const { mutateAsync: updateCar } = useMutation(
    trpc.car.updateCar.mutationOptions({
      onSuccess() {
        queryClient.invalidateQueries(trpc.car.cars.pathFilter());
      },
    }),
  );

  const cars = data?.pages.flatMap((page) => page.cars);

  const renderFooter = () => {
    if (isFetchingNextPage) {
      return (
        <View
          style={{ flexDirection: "row", alignItems: "center", padding: 16 }}
        >
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

  if (isLoading) {
    return (
      <View
        style={{
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
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
    <>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          icon="plus"
          onPress={() => router.push("/profile/cars/create")}
        />
      </Stack.Toolbar>
      <FlatList
        data={cars}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={getContentContainerStyle(cars?.length === 0)}
        renderItem={({ item: car }) => (
          <Menu
            activationMethod="longPress"
            trigger={
              <Card
                style={{
                  padding: 16,
                  gap: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ gap: 8, flexShrink: 1 }}>
                  <Text weight="500" style={{ flexWrap: "wrap" }}>
                    {car.make} {car.model} {car.year}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 8,
                    }}
                  >
                    <View
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: 16 / 2,
                        backgroundColor:
                          colorMap[car.color as keyof typeof colorMap] ??
                          car.color,
                      }}
                    />
                    {car.default && (
                      <View
                        style={{
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          borderRadius: 16,
                          backgroundColor: "#2e2e2e",
                        }}
                      >
                        <Text size="xs" weight="500" style={{ color: "white" }}>
                          Default
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                <Image
                  style={{ borderRadius: 12, width: 128, height: 80 }}
                  source={{ uri: car.photo }}
                  alt={`car-${car.id}`}
                />
              </Card>
            }
            options={[
              {
                title: "Make Default",
                show: !car.default,
                sfIcon: "car.badge.gearshape.fill",
                onClick: () => setDefault(car.id),
              },
              {
                title: "Delete",
                onClick: () => onDelete(car.id),
                sfIcon: "trash",
                destructive: true,
              },
            ]}
          />
        )}
        keyExtractor={(car) => car.id}
        ListEmptyComponent={
          <View style={{ alignItems: "center" }}>
            <Text weight="800" key="title" size="3xl">
              No Cars
            </Text>
            <Text key="message">You have no cars on your account!</Text>
          </View>
        }
        onEndReached={() => fetchNextPage()}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter()}
        refreshing={isRefetching}
        onRefresh={refetch}
      />
    </>
  );
}
