import React from "react";
import { Pressable } from "react-native";
import { gql, useQuery } from "@apollo/client";
import { GetBeepHistoryQuery, Beep, UserDataQuery } from "../generated/graphql";
import { Container } from "../components/Container";
import { Navigation } from "../utils/Navigation";
import {
  Spinner,
  Divider,
  Text,
  FlatList,
  Avatar,
  Flex,
  Box,
} from "native-base";
import { UserData } from "../App";

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
        <Flex direction="row" alignItems="center" p={2}>
          <Avatar
            size={50}
            mr={2}
            source={{
              uri: otherUser.photoUrl ? otherUser.photoUrl : undefined,
            }}
          />
          <Box>
            <Text>
              {user?.id === item.rider.id
                ? `${otherUser.name} beeped you`
                : `You beeped ${otherUser.name}`}
            </Text>
            <Text>{`Group size: ${item.groupSize}\nOrigin: ${
              item.origin
            }\nDestination: ${item.destination}\nDate: ${new Date(
              item.start
            ).toLocaleString()}`}</Text>
          </Box>
        </Flex>
      </Pressable>
    );
  };

  const renderBody = () => {
    if (error) {
      return (
        <Container alignItems="center" justifyContent="center">
          <Text>{error.message}</Text>
        </Container>
      );
    }
    if (loading) {
      return (
        <Container alignItems="center" justifyContent="center">
          <Text>Loading your history</Text>
          <Spinner />
        </Container>
      );
    }
    if (beeps && beeps.items.length > 0) {
      return (
        <Container alignItems="center" justifyContent="center">
          <FlatList
            w="100%"
            data={beeps.items}
            ItemSeparatorComponent={Divider}
            renderItem={renderItem}
          />
        </Container>
      );
    }
    return (
      <Container alignItems="center" justifyContent="center">
        <Text>Nothing to display!</Text>
        <Text>You have no previous beeps to display</Text>
      </Container>
    );
  };

  return renderBody();
}
