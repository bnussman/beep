import React, { useLayoutEffect } from "react";
import { Container } from "../../components/Container";
import { useNavigation } from "@react-navigation/native";
import { ApolloError, useMutation, useQuery } from "@apollo/client";
import { FlatList, Pressable, RefreshControl, useColorScheme } from "react-native";
import { isMobile, PAGE_SIZE, Unpacked } from "../../utils/constants";
import { Image } from "../../components/Image";
import { useUser } from "../../utils/useUser";
import { Alert } from "react-native";
import { cache } from "../../utils/apollo";
import { ResultOf, graphql } from "gql.tada";
import {
  Heading,
  Spinner,
  Text,
  Stack,
  XStack,
  Card,
  ThemeName,
} from "@beep/ui";
import { Plus } from "@tamagui/lucide-icons";

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
  const colorScheme = useColorScheme();
  const { user } = useUser();

  const { data, loading, error, refetch, fetchMore } = useQuery(
    CarsQuery,
    {
      variables: { id: user?.id, offset: 0, show: PAGE_SIZE },
      notifyOnNetworkStatusChange: true,
    }
  );

  const [_deleteCar] = useMutation(DeleteCar);

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
      <Stack ai="center" jc="center" p="$4">
        <Spinner/>
      </Stack>
    );
  };

  const onLongPress = (car: Unpacked<ResultOf<typeof CarsQuery>['getCars']['items']>) => {
    if (isMobile) {
      Alert.alert(
        "Delete Car?",
        "Are you sure you want to delete this car?",
        [
          {
            text: "No",
            style: "cancel",
          },
          { text: "Yes", onPress: () => deleteCar(car) },
        ],
        { cancelable: true }
      );
    } else {
      deleteCar(car);
    }
  };

  const deleteCar = (car: Unpacked<ResultOf<typeof CarsQuery>['getCars']['items']>) => {
    _deleteCar({
      variables: { id: car.id },
      update: (cache) => {
        cache.evict({
          id: cache.identify({
            __typename: "Car",
            id: car.id,
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
          <Pressable onPress={() => navigation.navigate("Add Car")} aria-label="Add a car">
            <Stack mx="$3">
              <Plus />
            </Stack>
          </Pressable>
        );
      },
    });
  }, [navigation]);

  if (!data && loading) {
    return (
      <Container center>
        <Spinner />
      </Container>
    );
  }

  if (error) {
    return (
      <Container center>
        <Text>{error.message}</Text>
      </Container>
    );
  }

  return (
    <Container>
      <FlatList
        data={cars}
        renderItem={({ item: car }) => (
          <Card
            mt="$2"
            mx="$2"
            px="$4"
            py="$3"
            pressTheme
            hoverTheme
            onLongPress={() => onLongPress(car)}
            onPress={car.default ? undefined : () => setDefault(car.id)}
          >
            <XStack alignItems="center">
              <Stack gap="$2">
                <Text
                  fontWeight="bold"
                  textTransform="capitalize"
                >
                  {car.make} {car.model} {car.year}
                </Text>
                <XStack gap="$2">
                  {car.default && (
                    <Card borderRadius="$4" backgroundColor="$gray10" px="$2">
                      <Text fontWeight="bold" color="white">Default</Text>
                    </Card>
                  )}
                  <Card
                    borderRadius="$4"
                    px="$2"
                    backgroundColor={`$${car.color}10`}
                  >
                    <Text textTransform="capitalize" fontWeight="bold" color="white">
                      {car.color}
                    </Text>
                  </Card>
                </XStack>
              </Stack>
              <Stack flexGrow={1} />
              <Image
                borderRadius="$4"
                w="$12"
                h="$8"
                source={{ uri: car.photo }}
                alt={`car-${car.id}`}
              />
            </XStack>
          </Card>
        )}
        keyExtractor={(car) => car.id}
        contentContainerStyle={
          cars?.length === 0
            ? { flex: 1, alignItems: "center", justifyContent: "center" }
            : undefined
        }
        ListEmptyComponent={
          <>
            <Heading fontWeight="bold" key="title">
              No Cars
            </Heading>
            <Text key="message">You have no cars on your account!</Text>
          </>
        }
        onEndReached={getMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter()}
        refreshControl={
          <RefreshControl
            // tintColor={colorMode === "dark" ? "#cfcfcf" : undefined}
            refreshing={isRefreshing}
            onRefresh={refetch}
          />
        }
      />
    </Container>
  );
}
