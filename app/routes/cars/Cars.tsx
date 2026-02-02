import React from "react";
import { ActivityIndicator, FlatList } from "react-native";
import { PAGE_SIZE } from "@/utils/constants";
import { Image } from "@/components/Image";
import { View } from "react-native";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { Menu } from "@/components/Menu";
import { orpc, useUser } from "@/utils/orpc";

export function Cars() {
  const { data: user } = useUser();

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
    orpc.car.cars.infiniteOptions(
      {
        input: (page) => ({
          userId: user?.id,
          pageSize: PAGE_SIZE,
          page
        }),
        placeholderData: keepPreviousData,
        initialPageParam: 1,
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
    orpc.car.deleteCar.mutationOptions({
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: orpc.car.cars.key() });
      },
      onError(error) {
        alert(error.message);
      },
    }),
  );

  const { mutateAsync: updateCar } = useMutation(
    orpc.car.updateCar.mutationOptions({
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: orpc.car.cars.key() });
      },
      onError(error) {
        alert(error.message);
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
    deleteCar({ carId: id });
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
          activationMethod="longPress"
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
                    <View
                      style={{
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 16,
                        backgroundColor: "#737373",
                      }}
                    >
                      <Text size="xs" weight="800" style={{ color: "white" }}>
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
              onClick: () => setDefault(car.id),
            },
            {
              title: "Delete",
              onClick: () => onDelete(car.id),
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
  );
}
