import React, { useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import { printStars } from "../../components/Stars";
import { GetBeeperListQuery, User } from "../../generated/graphql";
import { Navigation } from "../../utils/Navigation";
import { Container } from "../../components/Container";
import {
  Text,
  Spinner,
  FlatList,
  Divider,
  Flex,
  Badge,
  Pressable,
  Avatar,
  Box,
  HStack,
  Spacer,
  Heading,
} from "native-base";

interface Props {
  navigation: Navigation;
  route: any;
}

const GetBeepers = gql`
  query GetBeeperList($latitude: Float!, $longitude: Float!, $radius: Float) {
    getBeeperList(
      input: { latitude: $latitude, longitude: $longitude, radius: $radius }
    ) {
      id
      name
      first
      isStudent
      singlesRate
      groupRate
      capacity
      queueSize
      photoUrl
      role
      masksRequired
      rating
      venmo
      cashapp
      location {
        latitude
        longitude
      }
    }
  }
`;

function getDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d * 0.621371;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export function PickBeepScreen(props: Props): JSX.Element {
  const { navigation, route } = props;

  const { data, loading, error, startPolling, stopPolling } =
    useQuery<GetBeeperListQuery>(GetBeepers, {
      variables: {
        latitude: route.params.latitude,
        longitude: route.params.longitude,
        radius: 20,
      },
    });

  useEffect(() => {
    startPolling(6000);
    return () => {
      stopPolling();
    };
  }, []);

  function goBack(id: string): void {
    route.params.handlePick(id);
    navigation.goBack();
  }

  function getDescription(user: User): string {
    let distance = 0;
    if (user.location) {
      distance = getDistance(
        route.params.latitude,
        route.params.longitude,
        user.location?.latitude,
        user.location?.longitude
      );
    }
    return `Queue Size: ${user.queueSize}\nCapacity: ${
      user.capacity
    } riders\nSingles: $${user.singlesRate}\nGroups: $${
      user.groupRate
    }\nDistance from you: ${distance.toFixed(2)} mi`;
  }

  const renderItem = ({ item }: { item: User }) => (
    <Pressable onPress={() => goBack(item.id)}>
      <Flex alignItems="center" direction="row" p={2}>
        <Avatar mr={2} size={50} source={{ uri: item.photoUrl || "" }} />
        <Box>
          <Heading size="md">{item.name}</Heading>
          <Text fontSize="xs">{getDescription(item)}</Text>
        </Box>
        <Spacer />
        <HStack space={2} mr={2}>
          {item.rating ? <Badge>{printStars(item.rating)}</Badge> : null}
          {item.role === "admin" ? (
            <Badge colorScheme="danger">Founder</Badge>
          ) : null}
          {item.masksRequired ? <Badge colorScheme="dark">Masks</Badge> : null}
          {item.venmo ? <Badge colorScheme="info">Venmo</Badge> : null}
          {item.cashapp ? <Badge colorScheme="success">Cash App</Badge> : null}
        </HStack>
      </Flex>
    </Pressable>
  );

  if (loading) {
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

  if (data?.getBeeperList && data.getBeeperList.length === 0) {
    return (
      <Container alignItems="center" justifyContent="center">
        <Heading>Nobody is beeping</Heading>
        <Text>There are no drivers within 20 miles of you</Text>
      </Container>
    );
  }

  return (
    <Container>
      {data?.getBeeperList && data.getBeeperList.length > 0 ? (
        <FlatList
          data={data.getBeeperList as User[]}
          ItemSeparatorComponent={Divider}
          renderItem={renderItem}
        />
      ) : null}
    </Container>
  );
}
