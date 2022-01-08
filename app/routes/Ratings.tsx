import React, { useContext } from "react";
import { Pressable } from "react-native";
import { gql, useQuery } from "@apollo/client";
import { GetRatingsQuery, Rating } from "../generated/graphql";
import { printStars } from "../components/Stars";
import { Navigation } from "../utils/Navigation";
import { UserContext } from "../utils/UserContext";
import { Container } from "../components/Container";
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
  const user = useContext(UserContext);
  const { data, loading, error } = useQuery<GetRatingsQuery>(Ratings, {
    variables: { id: user.id },
  });

  const renderItem = ({ item }: { item: Rating }) => {
    const otherUser = user.id === item.rater.id ? item.rated : item.rater;
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
              {user.id === item.rater.id
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

  return (
    <Container>
      <>
        {data?.getRatings?.items && data.getRatings.count > 0 ? (
          <FlatList
            data={data?.getRatings.items}
            ItemSeparatorComponent={Divider}
            renderItem={renderItem}
          />
        ) : (
          <Text>Nothing to display!</Text>
        )}
        {loading && <Spinner />}
        {error && <Text>{error.message}</Text>}
      </>
    </Container>
  );
}
