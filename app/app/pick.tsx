import React from "react";
import { useRoute } from "@react-navigation/native";
import { ApolloError, gql, useMutation, useQuery } from "@apollo/client";
import { printStars } from "../components/Stars";
import { Unpacked } from "../utils/constants";
import { RefreshControl } from "react-native";
import { ChooseBeepMutation, ChooseBeepMutationVariables, GetBeepersQuery } from "../generated/graphql";
import { Container } from "../components/Container";
import { Avatar } from "../components/Avatar";
import { Card } from "../components/Card";
import { useLocation } from "../utils/useLocation";
import {
  Text,
  Spinner,
  FlatList,
  Badge,
  Box,
  HStack,
  Spacer,
  Heading,
  useColorMode,
  Stack,
} from "native-base";
import { router, useLocalSearchParams } from "expo-router";
import { client } from "../utils/Apollo";
import { InitialRiderStatus } from "./(app)/ride";
import { Alert } from "../utils/Alert";

const GetBeepers = gql`
  query GetBeepers($latitude: Float!, $longitude: Float!, $radius: Float) {
    getBeepersNew(latitude: $latitude, longitude: $longitude, radius: $radius) {
      id
      name
      first
      isStudent
      singlesRate
      groupRate
      capacity
      queueSize
      photo
      role
      rating
      venmo
      cashapp
      payments {
        id
        productId
      }
    }
  }
`;

const ChooseBeep = gql`
  mutation ChooseBeep(
    $beeperId: String!
    $origin: String!
    $destination: String!
    $groupSize: Float!
  ) {
    chooseBeep(
      beeperId: $beeperId
      input: {
        origin: $origin
        destination: $destination
        groupSize: $groupSize
      }
    ) {
      id
      position
      origin
      destination
      status
      groupSize
      beeper {
        id
        first
        name
        singlesRate
        groupRate
        isStudent
        role
        venmo
        cashapp
        username
        phone
        photo
        capacity
        queueSize
        location {
          longitude
          latitude
        }
        cars {
          id
          photo
          make
          color
          model
        }
      }
    }
  }
`;


export default function PickBeepScreen() {
  const { colorMode } = useColorMode();
  const { location } = useLocation();
  const params = useLocalSearchParams();

  const { data, loading, error, refetch } = useQuery<GetBeepersQuery>(
    GetBeepers,
    {
      variables: {
        latitude: location?.coords.latitude,
        longitude: location?.coords.longitude,
        radius: 20,
      },
      skip: !location,
      notifyOnNetworkStatusChange: true,
    }
  );

  const beepers = data?.getBeepersNew;
  const isRefreshing = Boolean(data) && loading;

  const [getBeep, { loading: isGetBeepLoading, error: getBeepError }] =
    useMutation<ChooseBeepMutation>(ChooseBeep);

  const chooseBeep = async (beeperId: string) => {

    try {
      const { data } = await getBeep({
        variables: {
          groupSize: +params.groupSize,
          origin: params.origin,
          destination: params.destination,
          beeperId,
        },
      });

      if (data) {
        client.writeQuery({
          query: InitialRiderStatus,
          data: { getRiderStatus: { ...data.chooseBeep } },
        });

        router.back();
      }
    } catch (error) {
      Alert(error as ApolloError);
    }
  };

  const renderItem = ({ item, index }: { item: Unpacked<GetBeepersQuery["getBeepersNew"]>; index: number; }) => {
    const isPremium = item.payments?.some(p => p.productId.startsWith("top_of_beeper_list")) ?? false;

    return (
      <Box
        bg={{
          linearGradient: {
            colors: ['#ff930f', '#fff95b'],
            start: [0, 0],
            end: [1, 0]
          }
        }}
        rounded="xl"
        mx={2.5}
        mt={index === 0 ? 3 : 2.5}
        p={isPremium ? 0.5 : 0}
      >
        <Card
          pressable
          onPress={() => chooseBeep(item.id)}
          borderWidth={isPremium ? 0 : "2px"}
        >
          <HStack alignItems="center">
            <Stack flexShrink={1}>
              <HStack alignItems="center" mb={2}>
                <Avatar mr={2} size="45px" url={item.photo} />
                <Stack>
                  <Text
                    fontWeight="extrabold"
                    fontSize="lg"
                    letterSpacing="sm"
                    isTruncated
                  >
                    {item.name}
                  </Text>
                  {item.rating && (
                    <Text fontSize="xs">{printStars(item.rating)}</Text>
                  )}
                </Stack>
              </HStack>
              <Box>
                <Text>
                  <Text bold>Queue Size </Text>
                  <Text>{item.queueSize}</Text>
                </Text>
                <Text>
                  <Text bold>Capacity </Text>
                  <Text>{item.capacity}</Text>
                </Text>
                <Text>
                  <Text bold>Rates </Text>
                  <Text>
                    ${item.singlesRate} singles / ${item.groupRate} group
                  </Text>
                </Text>
              </Box>
            </Stack>
            <Spacer />
            <Stack space={2} flexShrink={1}>
              {item.venmo && (
                <Badge
                  bg="black"
                  _text={{ color: "white" }}
                  rounded="xl"
                  _dark={{ bg: "white", _text: { color: "gray.600" } }}
                >
                  Venmo
                </Badge>
              )}
              {item.cashapp && (
                <Badge
                  bg="black"
                  _text={{ color: "white" }}
                  rounded="xl"
                  _dark={{ bg: "white", _text: { color: "gray.600" } }}
                >
                  Cash App
                </Badge>
              )}
            </Stack>
          </HStack>
        </Card>
      </Box>
    )
  };

  if ((!data && loading) || location === undefined) {
    return (
      <Container alignItems="center" justifyContent="center">
        <Spinner size="lg" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container alignItems="center" justifyContent="center">
        <Heading>Error</Heading>
        <Text>{error.message}</Text>
      </Container>
    );
  }

  return (
    <Container h="100%">
      <FlatList
        height="100%"
        data={beepers}
        renderItem={renderItem}
        keyExtractor={(beeper) => beeper.id}
        contentContainerStyle={
          beepers?.length === 0
            ? { flex: 1, alignItems: "center", justifyContent: "center" }
            : undefined
        }
        ListEmptyComponent={
          <>
            <Heading key="title">Nobody is beeping</Heading>
            <Text key="message">
              There are no drivers within 20 miles of you
            </Text>
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
