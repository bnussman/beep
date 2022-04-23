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
            size={130}
            source={{
              uri: data.getUser.photoUrl ? data.getUser.photoUrl : undefined,
            }}
          />
          <Heading>{data.getUser.name}</Heading>
          {props.route.params.id !== user?.id ? (
            <HStack space={4}>
              <Button
                colorScheme="red"
                variant="subtle"
                onPress={() => handleReport()}
              >
                Report User
              </Button>
              <Button colorScheme="blue" onPress={() => handleRate()}>
                Rate User
              </Button>
            </HStack>
          ) : null}
          {data.getUser.isBeeping ? (
            <>
              <Text>Queue Size</Text>
              <Text>{data.getUser.queueSize}</Text>
            </>
          ) : null}
          {data?.getUser.venmo ? (
            <>
              <Text>Venmo</Text>
              <Text>@{data.getUser.venmo}</Text>
            </>
          ) : null}
          {data?.getUser.cashapp ? (
            <>
              <Text>Cash App</Text>
              <Text>@{data.getUser.cashapp}</Text>
            </>
          ) : null}
          <Text>Capacity</Text>
          <Text>{data.getUser.capacity}</Text>
          <Text>Singles Rate</Text>
          <Text>${data.getUser.singlesRate}</Text>
          <Text>Group Rate</Text>
          <Text>${data.getUser.groupRate}</Text>
          {data.getUser.rating ? (
            <>
              <Text>Rating</Text>
              <Text>{printStars(data.getUser.rating)}</Text>
            </>
          ) : null}
        </Stack>
      </Center>
    </Container>
  );
}
