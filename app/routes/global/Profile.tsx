import React from "react";
import { useUser } from "../../utils/useUser";
import { gql, useQuery } from "@apollo/client";
import { printStars } from "../../components/Stars";
import { Container } from "../../components/Container";
import { Navigation } from "../../utils/Navigation";
import { GetUserProfileQuery, User } from "../../generated/graphql";
import { Avatar } from "../../components/Avatar";
import {
  Spinner,
  Text,
  Button,
  Stack,
  HStack,
  Center,
  Heading,
} from "native-base";
import { useNavigation, useRoute } from "@react-navigation/native";

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
      photoUrl
      queueSize
      rating
    }
  }
`;

export function ProfileScreen() {
  const { user } = useUser();
  const { params } = useRoute<any>();
  const { navigate } = useNavigation<Navigation>();

  const { data, loading, error } = useQuery<GetUserProfileQuery>(GetUser, {
    variables: { id: params.id },
  });

  function handleReport() {
    navigate("Report", {
      user: data?.getUser as User,
      id: params.id,
      name: data?.getUser.name || "",
      beep: params.beep,
    });
  }

  function handleRate() {
    if (params.beep) {
      navigate("Rate", {
        user: data?.getUser as User,
        beep: params.beep,
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
            url={data.getUser.photoUrl}
          />
          <Heading size="2xl" fontWeight="extrabold">
            {data.getUser.name}
          </Heading>
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
          {params?.id !== user?.id ? (
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
