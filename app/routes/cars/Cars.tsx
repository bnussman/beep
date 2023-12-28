import React, { useLayoutEffect } from "react";
import { Container } from "../../components/Container";
import { useNavigation } from "@react-navigation/native";
import { Navigation } from "../../utils/Navigation";
import { Ionicons } from "@expo/vector-icons";
import { ApolloError, gql, useMutation, useQuery } from "@apollo/client";
import { FlatList, Pressable, RefreshControl, useColorScheme } from "react-native";
import { isMobile, PAGE_SIZE, Unpacked } from "../../utils/constants";
import { Card } from "../../components/Card";
import { Image } from "../../components/Image";
import { useUser } from "../../utils/useUser";
import { Alert } from "react-native";
import { cache } from "../../utils/Apollo";
import {
  DeleteCarMutation,
  EditCarMutation,
  GetCarsQuery,
} from "../../generated/graphql";
import {
  Spinner,
  Text,
  Stack,
  XStack,
  Button,
  H1,
  SizableText,
} from "tamagui";
import { Plus } from "@tamagui/lucide-icons";

export const DeleteCar = gql`
  mutation DeleteCar($id: String!) {
    deleteCar(id: $id)
  }
`;

export const EditCar = gql`
  mutation EditCar($default: Boolean!, $id: String!) {
    editCar(default: $default, id: $id) {
      id
      default
    }
  }
`;

export const CarsQuery = gql`
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
`;

export function Cars() {
  const navigation = useNavigation<Navigation>();
  const colorMode = useColorScheme();
  const { user } = useUser();

  const { data, loading, error, refetch, fetchMore } = useQuery<GetCarsQuery>(
    CarsQuery,
    {
      variables: { id: user?.id, offset: 0, show: PAGE_SIZE },
      notifyOnNetworkStatusChange: true,
    }
  );

  const [_deleteCar] = useMutation<DeleteCarMutation>(DeleteCar);

  const [editCar] = useMutation<EditCarMutation>(EditCar);

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
      <Center>
        <Spinner mt={4} mb={9} color="gray.400" />
      </Center>
    );
  };

  const onLongPress = (car: Unpacked<GetCarsQuery["getCars"]["items"]>) => {
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

  const deleteCar = (car: Unpacked<GetCarsQuery["getCars"]["items"]>) => {
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
          <Pressable
            style={{ marginRight: 16 }}
            onPress={() => navigation.navigate("Add Car")}
          >
            <Plus />
          </Pressable>
        );
      },
    });
  }, [navigation, colorMode]);

  if (!data && loading) {
    return (
      <Container center>
        <Spinner size="small" />
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
            mx="$2"
            my="$2"
            pressable
            onLongPress={() => onLongPress(car)}
            onPress={car.default ? undefined : () => setDefault(car.id)}
          >
            <XStack alignItems="center" justifyContent="space-between">
              <Stack space={2}>
                <SizableText textTransform="capitalize" fontWeight="bold">
                  {car.make} {car.model} {car.year}
                </SizableText>
                <XStack space="$2">
                  {car.default && (
                    <Stack bg="$gray5" p="$1" borderRadius="$2">
                      <SizableText size="$2">Default</SizableText>
                    </Stack>
                  )}
                  <Stack bg={car.color} px="$2" borderRadius="$2" alignItems="center">
                    <SizableText size="$2" textTransform="capitalize">
                      {car.color}
                    </SizableText>
                  </Stack>
                </XStack>
              </Stack>
              <Image
                borderRadius="$5"
                width={84}
                h={64}
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
            <H1 key="heading">
              No Cars
            </H1>
            <SizableText key="message">You have no cars on your account!</SizableText>
          </>
        }
        onEndReached={getMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter()}
        refreshControl={
          <RefreshControl
            tintColor={colorMode === "dark" ? "#cfcfcf" : undefined}
            refreshing={isRefreshing}
            onRefresh={refetch}
          />
        }
      />
    </Container>
  );
}
