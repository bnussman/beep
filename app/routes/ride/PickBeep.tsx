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
import { client } from "../../utils/Apollo";
import { InitialRiderStatus } from "./FindBeep";
import { FlatList } from "react-native";
import {
  Text,
  Spinner,
  XStack,
  Spacer,
  Heading,
  Stack,
  H3,
  SizableText,
} from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";

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
          groupSize: Number(params.groupSize),
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
      <LinearGradient
        borderRadius="$4"
        mx="$2"
        mt={index === 0 ? "$2" : undefined}
        p={isPremium ? "$1" : 0}
        colors={['#ff930f', '#fff95b']}
        start={[0, 0]}
        end={[1, 0]}
      >
        <Card
          pressable
          onPress={() => chooseBeep(item.id)}
          borderWidth={isPremium ? 0 : "2px"}
        >
          <XStack alignItems="center">
            <Stack flexShrink={1}>
              <XStack alignItems="center" mb={2}>
                <Avatar mr="$2" size="$4" url={item.photo} />
                <Stack>
                  <SizableText fontWeight="bold">
                    {item.name}
                  </SizableText>
                  {item.rating && (
                    <SizableText fontSize="$1">{printStars(item.rating)}</SizableText>
                  )}
                </Stack>
              </XStack>
              <Stack>
                <SizableText>
                  <SizableText fontWeight="bold">Queue Size </SizableText>
                  <SizableText>{item.queueSize}</SizableText>
                </SizableText>
                <SizableText>
                  <SizableText fontWeight="bold">Capacity </SizableText>
                  <SizableText>{item.capacity}</SizableText>
                </SizableText>
                <SizableText>
                  <SizableText fontWeight="bold">Rates </SizableText>
                  <SizableText>
                    ${item.singlesRate} singles / ${item.groupRate} group
                  </SizableText>
                </SizableText>
              </Stack>
            </Stack>
            <Stack flexGrow={1} />
            <Stack space={2} flexShrink={1}>
              {item.venmo && (
                <SizableText
                  bg="black"
                  color="white"
                  px="$2"
                  borderRadius="$4"
                >
                  Venmo
                </SizableText>
              )}
              {item.cashapp && (
                <SizableText
                  bg="black"
                  color="white"
                  px="$2"
                  borderRadius="$4"
                >
                  Cash App
                </SizableText>
              )}
            </Stack>
          </XStack>
        </Card>
      </LinearGradient>
    )
  };

  if ((!data && loading) || location === undefined) {
    return (
      <Container alignItems="center" justifyContent="center">
        <Spinner size="small" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container alignItems="center" justifyContent="center">
        <Heading>Error</Heading>
        <SizableText>{error.message}</SizableText>
      </Container>
    );
  }

  return (
    <Container h="100%">
      <FlatList
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
            <H3 fontWeight="bold" key="title">Nobody is beeping</H3>
            <SizableText key="message">
              There are no drivers within 20 miles of you
            </SizableText>
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
