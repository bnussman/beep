import React, { useLayoutEffect } from "react";
import { Container } from "../../components/Container";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { ApolloError, gql, useMutation, useQuery } from "@apollo/client";
import { RefreshControl } from "react-native";
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
  FlatList,
  Heading,
  Icon,
  IconButton,
  Spinner,
  Text,
  useColorMode,
  Stack,
  HStack,
  Spacer,
  Badge,
  Center,
} from "native-base";
import { router } from "expo-router";

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

export default function Cars() {
  const navigation = useNavigation();
  const { colorMode } = useColorMode();
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
          <IconButton
            onPress={() => router.push("/add-car")}
            mr={2}
            icon={
              <Icon
                as={Ionicons}
                name="ios-add-sharp"
                size="xl"
                color={colorMode === "dark" ? "white" : "black"}
              />
            }
          />
        );
      },
    });
  }, [navigation, colorMode]);

  if (!data && loading) {
    return (
      <Container center>
        <Spinner size="lg" />
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
        height="100%"
        data={cars}
        renderItem={({ item: car }) => (
          <Card
            mt={2}
            mx={1}
            pressable
            onLongPress={() => onLongPress(car)}
            onPress={car.default ? undefined : () => setDefault(car.id)}
          >
            <HStack alignItems="center">
              <Stack space={2}>
                <Heading
                  fontSize="md"
                  fontWeight="extrabold"
                  letterSpacing="sm"
                  textTransform="capitalize"
                >
                  {car.make} {car.model} {car.year}
                </Heading>
                <HStack space={3}>
                  {car.default && <Badge borderRadius="lg">Default</Badge>}
                  <Badge
                    borderRadius="lg"
                    _text={{ textTransform: "capitalize" }}
                    colorScheme={
                      ["black", "white"].includes(car.color)
                        ? undefined
                        : car.color
                    }
                  >
                    {car.color}
                  </Badge>
                </HStack>
              </Stack>
              <Spacer />
              <Image
                borderRadius="xl"
                w={24}
                h={16}
                source={{ uri: car.photo }}
                alt={`car-${car.id}`}
              />
            </HStack>
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
            <Heading fontWeight="extrabold" letterSpacing="sm" key="title">
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
            tintColor={colorMode === "dark" ? "#cfcfcf" : undefined}
            refreshing={isRefreshing}
            onRefresh={refetch}
          />
        }
      />
    </Container>
  );
}
