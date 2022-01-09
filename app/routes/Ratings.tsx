import React from "react";
import { Pressable } from "react-native";
import { gql, useQuery } from "@apollo/client";
import { GetRatingsQuery, Rating, UserDataQuery } from "../generated/graphql";
import { printStars } from "../components/Stars";
import { Navigation } from "../utils/Navigation";
import { Container } from "../components/Container";
import { UserData } from "../App";
import {
  Text,
  FlatList,
  Divider,
  Spinner,
  Avatar,
  Flex,
  Box,
} from "native-base";

interface Props {
  navigation: Navigation;
}

const Ratings = gql`
  query GetRatings($id: String) {
    getRatings(id: $id) {
      items {
        id
        stars
        timestamp
        message
        rater {
          id
          name
          photoUrl
        }
        rated {
          id
          name
          photoUrl
        }
      }
      count
    }
  }
`;

export function RatingsScreen(props: Props): JSX.Element {
  const { data: userData } = useQuery<UserDataQuery>(UserData);

  const user = userData?.getUser;

  const { data, loading, error } = useQuery<GetRatingsQuery>(Ratings, {
    variables: { id: user?.id },
  });

  const ratings = data?.getRatings;

  const renderItem = ({ item }: { item: Rating }) => {
    const otherUser = user?.id === item.rater.id ? item.rated : item.rater;

    return (
      <Pressable
        onPress={() => props.navigation.push("Profile", { id: otherUser.id })}
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
              {user?.id === item.rater.id
                ? `You rated ${otherUser.name}`
                : `${otherUser.name} rated you`}
            </Text>
            <Text>{`Message: ${item.message || "N/A"}\nStars: ${printStars(
              item.stars
            )} ${item.stars}\n`}</Text>
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
          <Text>Loading your ratings</Text>
          <Spinner />
        </Container>
      );
    }
    if (ratings && ratings.items.length > 0) {
      return (
        <Container alignItems="center" justifyContent="center">
          <FlatList
            w="100%"
            data={ratings.items}
            ItemSeparatorComponent={Divider}
            renderItem={renderItem}
          />
        </Container>
      );
    }
    return (
      <Container alignItems="center" justifyContent="center">
        <Text>Nothing to display!</Text>
        <Text>You have no ratings to display</Text>
      </Container>
    );
  };

  return renderBody();
}
