import React, { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { ActivityIndicator, FlatList, Pressable } from "react-native";
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

export function Cars() {
  const trpc = useTRPC();
  const navigation = useNavigation();
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
        <Text>{error.message}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={cars}
      contentContainerStyle={
        cars?.length === 0
          ? { alignItems: "center", justifyContent: "center", height: "100%" }
          : { flex: 1, padding: 12, gap: 8 }
      }
      renderItem={({ item: car }) => (
        <Menu
          trigger={
            <Card
              pressable
              style={{
                padding: 16,
                gap: 16,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ gap: 8, flexShrink: 1 }}>
                <Text
                  weight="bold"
                  style={{ textTransform: "capitalize", flexWrap: "wrap" }}
                >
                  {car.color} {car.make} {car.model} {car.year}
                </Text>
                <View
                  style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}
                >
                  {car.default && (
                    <Card
                      style={{
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        backgroundColor: "#737373",
                      }}
                    >
                      <Text size="xs" weight="800" style={{ color: "white" }}>
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
          }
          options={[
            {
              title: "Make Default",
              onClick: () => setDefault(car.id),
            },
            {
              title: "Delete",
              onClick: () => onDelete(car.id),
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
  );
}
