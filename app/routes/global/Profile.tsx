import React from "react";
import { useUser } from "../../utils/useUser";
import { gql, useQuery } from "@apollo/client";
import { printStars } from "../../components/Stars";
import { Container } from "../../components/Container";
import { Navigation } from "../../utils/Navigation";
import { GetUserProfileQuery, User } from "../../generated/graphql";
import {
  Spinner,
  Text,
  Button,
  Avatar,
  Stack,
  HStack,
  Center,
  Heading,
  Box,
  Spacer,
} from "native-base";

interface Props {
  route: any;
  navigation: Navigation;
}

const GetUser = gql`
  query GetUserProfile($id: String!) {
    getUser(id: $id) {
      id
      name
      username
      name
      isBeeping
      isStudent
      role
      venmo
      cashapp
      singlesRate
      groupRate
      capacity
      masksRequired
      photoUrl
      queueSize
      rating
    }
  }
`;

export function ProfileScreen(props: Props) {
  const { user } = useUser();

  const { data, loading, error } = useQuery<GetUserProfileQuery>(GetUser, {
    variables: { id: props.route.params.id },
  });

  function handleReport() {
    props.navigation.navigate("Report", {
      id: props.route.params.id,
      name: data?.getUser.name || "",
      beep: props.route.params.beep,
    });
  }

  function handleRate() {
    if (props.route.params.beep) {
      props.navigation.navigate("Rate", {
        user: data?.getUser as User,
        beep: props.route.params.beep,
      });
    } else {
      alert(
        "You can only leave a rating when you've interacted with this user."
      );
    }
  }

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
        <Text>{error.message}</Text>
      </Container>
    );
  }

  if (!data?.getUser) {
    return (
      <Container alignItems="center" justifyContent="center">
        <Text>User does not exist</Text>
      </Container>
    );
  }

  return (
    <Container>
      <Center>
        <Stack space={2} alignItems="center">
          <Avatar
            mt={4}
            size={40}
            source={{
              uri: data.getUser.photoUrl ? data.getUser.photoUrl : undefined,
            }}
          />
          <Heading size="2xl" fontWeight="extrabold">{data.getUser.name}</Heading>
          <Stack space={4}>
            {data.getUser.isBeeping ? (
              <Text>
                <Text fontWeight="extrabold">Queue Size </Text>
                <Text>{data.getUser.queueSize}</Text>
              </Text>
            ) : null}
            {data?.getUser.venmo ? (
              <Text>
                <Text fontWeight="extrabold">Venmo </Text>
                <Text>@{data.getUser.venmo}</Text>
              </Text>
            ) : null}
            {data?.getUser.cashapp ? (
              <Text>
                <Text fontWeight="extrabold">Cash App </Text>
                <Text>@{data.getUser.cashapp}</Text>
              </Text>
            ) : null}
            <Text>
              <Text fontWeight="extrabold">Capacity </Text>
              <Text>{data.getUser.capacity}</Text>
            </Text>
            <Text>
              <Text fontWeight="extrabold">Singles Rate </Text>
              <Text>${data.getUser.singlesRate}</Text>
            </Text>
            <Text>
              <Text fontWeight="extrabold">Group Rate </Text>
              <Text>${data.getUser.groupRate}</Text>
            </Text>
            {data.getUser.rating ? (
              <Text>
                <Text fontWeight="extrabold">Rating </Text>
                <Text>{printStars(data.getUser.rating)}</Text>
              </Text>
            ) : null}
          </Stack>
          {props.route.params.id !== user?.id ? (
            <HStack space={4} mt={4}>
              <Button onPress={() => handleReport()}>Report User</Button>
              <Button onPress={() => handleRate()}>Rate User</Button>
            </HStack>
          ) : null}
        </Stack>
      </Center>
    </Container>
  );
}
