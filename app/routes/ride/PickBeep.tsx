import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ApolloError, gql, useMutation, useQuery } from "@apollo/client";
import { printStars } from "../../components/Stars";
import { Unpacked } from "../../utils/constants";
import { RefreshControl, useColorScheme } from "react-native";
import { ChooseBeepMutation, GetBeepersQuery } from "../../generated/graphql";
import { Navigation } from "../../utils/Navigation";
import { Container } from "../../components/Container";
import { Avatar } from "../../components/Avatar";
import { Card } from "../../components/Card";
import { useLocation } from "../../utils/useLocation";
import {
  Text,
  Spinner,
  Box,
  XStack,
  Spacer,
  Heading,
  Stack,
} from "tamagui";
import { client } from "../../utils/Apollo";
import { InitialRiderStatus } from "./FindBeep";
import { FlatList } from "react-native";

const GetBeepers = gql`
  query GetBeepers($latitude: Float!, $longitude: Float!, $radius: Float) {
    getBeepers(latitude: $latitude, longitude: $longitude, radius: $radius) {
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

export function PickBeepScreen() {
  const colorMode = useColorScheme();
  const { location } = useLocation();
  const { params } = useRoute<any>();
  const navigation = useNavigation<Navigation>();

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

  const [getBeep, { loading: isGetBeepLoading, error: getBeepError }] =
    useMutation<ChooseBeepMutation>(ChooseBeep);

  const chooseBeep = async ( beeperId: string,) => {
    try {
      const { data } = await getBeep({
        variables: {
          ...params,
          beeperId,
        },
      });

      if (data) {
        client.writeQuery({
          query: InitialRiderStatus,
          data: { getRiderStatus: { ...data.chooseBeep } },
        });
        navigation.goBack();
      }
    } catch (error) {
      alert((error as ApolloError).message);
    }
  };

  const beepers = data?.getBeepers;
  const isRefreshing = Boolean(data) && loading;

  const renderItem = ({ item, index }: { item: Unpacked<GetBeepersQuery["getBeepers"]>; index: number; }) => {
    const isPremium = item.payments?.some(p => p.productId.startsWith("top_of_beeper_list")) ?? false;

    return (
      <Stack
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
          <XStack alignItems="center">
            <Stack flexShrink={1}>
              <XStack alignItems="center" mb={2}>
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
              </XStack>
              <Stack>
                <Text>
                  <Text>Queue Size </Text>
                  <Text>{item.queueSize}</Text>
                </Text>
                <Text>
                  <Text>Capacity </Text>
                  <Text>{item.capacity}</Text>
                </Text>
                <Text>
                  <Text bold>Rates </Text>
                  <Text>
                    ${item.singlesRate} singles / ${item.groupRate} group
                  </Text>
                </Text>
              </Stack>
            </Stack>
            <Spacer />
            <Stack space={2} flexShrink={1}>
              {item.venmo && (
                <Text
                  bg="black"
                  _text={{ color: "white" }}
                  rounded="xl"
                  _dark={{ bg: "white", _text: { color: "gray.600" } }}
                >
                  Venmo
                </Text>
              )}
              {item.cashapp && (
                <Text
                  bg="black"
                  _text={{ color: "white" }}
                  rounded="xl"
                  _dark={{ bg: "white", _text: { color: "gray.600" } }}
                >
                  Cash App
                </Text>
              )}
            </Stack>
          </XStack>
        </Card>
      </Stack>
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
