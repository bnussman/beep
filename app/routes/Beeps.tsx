import React from "react";
import { Pressable } from "react-native";
import { gql, useQuery } from "@apollo/client";
import { GetBeepHistoryQuery, Beep, UserDataQuery } from "../generated/graphql";
import { Container } from "../components/Container";
import { Navigation } from "../utils/Navigation";
import { UserData } from "../App";
import {
  Spinner,
  Divider,
  Text,
  FlatList,
  Avatar,
  Flex,
  Box,
  Heading,
  HStack,
} from "native-base";

interface Props {
  navigation: Navigation;
}

const GetBeepHistory = gql`
  query GetBeepHistory($id: String) {
    getBeeps(id: $id) {
      items {
        id
        start
        end
        groupSize
        origin
        destination
        rider {
          id
          name
          first
          last
          photoUrl
        }
        beeper {
          id
          name
          first
          last
          photoUrl
        }
      }
      count
    }
  }
`;

export function BeepsScreen(props: Props): JSX.Element {
  const { data: userData } = useQuery<UserDataQuery>(UserData);

  const user = userData?.getUser;

  const { data, loading, error } = useQuery<GetBeepHistoryQuery>(
    GetBeepHistory,
    { variables: { id: user?.id } }
  );

  const beeps = data?.getBeeps;

  const renderItem = ({ item }: { item: Beep }) => {
    const otherUser = user?.id === item.rider.id ? item.beeper : item.rider;
    return (
      <Pressable
        onPress={() =>
          props.navigation.push("Profile", { id: otherUser.id, beep: item.id })
        }
      >
        <Box
          mx={4}
          my={2}
          px={4}
          py={4}
          _light={{ bg: "coolGray.100" }}
          _dark={{ bg: "gray.900" }}
          rounded="lg"
        >
          <HStack alignItems="center">
            <Avatar
              size={35}
              mr={2}
              source={{
                uri: otherUser.photoUrl ? otherUser.photoUrl : undefined,
              }}
            />
            <Heading size="md">
              {user?.id === item.rider.id
                ? `${otherUser.name} beeped you`
                : `You beeped ${otherUser.name}`}
            </Heading>
          </HStack>
          <Text>
            <Text bold>Group size:</Text> <Text>{item.groupSize}</Text>
          </Text>
          <Text>
            <Text bold>Pick Up:</Text> <Text>{item.origin}</Text>
          </Text>
          <Text>
            <Text bold>Drop Off:</Text> <Text>{item.destination}</Text>
          </Text>
          <Text>
            <Text bold>Date:</Text>{" "}
            <Text>{new Date(item.start).toLocaleString()}</Text>
          </Text>
        </Box>
      </Pressable>
    );
  };

  if (loading) {
    return (
      <Container alignItems="center" justifyContent="center">
        <Text>Loading your history</Text>
        <Spinner />
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

  if (beeps && beeps.items.length > 0) {
    return (
      <Container alignItems="center" justifyContent="center">
        <FlatList w="100%" data={beeps.items} renderItem={renderItem} />
      </Container>
    );
  }

  return (
    <Container alignItems="center" justifyContent="center">
      <Text>Nothing to display!</Text>
      <Text>You have no previous beeps to display</Text>
    </Container>
  );
}
