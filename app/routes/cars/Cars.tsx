import React, { useLayoutEffect } from "react";
import { Container } from "../../components/Container";
import { useNavigation } from "@react-navigation/native";
import { Navigation } from "../../utils/Navigation";
import { Ionicons } from "@expo/vector-icons";
import { gql, useQuery } from "@apollo/client";
import { GetCarsQuery } from "../../generated/graphql";
import { RefreshControl } from "react-native";
import { Card } from "../../components/Card";
import { Image } from "../../components/Image";
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
} from "native-base";
import { useUser } from "../../utils/useUser";

export const CarsQuery = gql`
  query GetCars($getCarsId: String, $offset: Int, $show: Int) {
    getCars(id: $getCarsId, offset: $offset, show: $show) {
      items {
        id
        make
        model
        year
        color
        photo
      }
      count
    }
  }
`;

export function Cars() {
  const navigation = useNavigation<Navigation>();
  const { colorMode } = useColorMode();
  const { user } = useUser();

  const { data, loading, error, refetch } = useQuery<GetCarsQuery>(CarsQuery, {
    variables: { id: user?.id },
  });

  const cars = data?.getCars.items;

  const isRefreshing = Boolean(data) && loading;

  useLayoutEffect(() => {
    const navigator = navigation.getParent();
    navigator?.setOptions({
      headerRight: () => {
        return (
          <IconButton
            onPress={() => navigation.navigate("Add Car")}
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
        p={2}
        data={cars}
        renderItem={({ item: car }) => (
          <Card my={2}>
            <HStack alignItems="center">
              <Stack>
                <Heading
                  fontSize="md"
                  fontWeight="extrabold"
                  letterSpacing="sm"
                  textTransform="capitalize"
                >
                  {car.make} {car.model} {car.year}
                </Heading>
                <Text textTransform="capitalize">{car.color}</Text>
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
