import React from "react";
import { Pressable } from "react-native";
import { useUser } from "../utils/useUser";
import { gql, useQuery } from "@apollo/client";
import { GetRatingsQuery, Rating } from "../generated/graphql";
import { printStars } from "../components/Stars";
import { Navigation } from "../utils/Navigation";
import { Container } from "../components/Container";
import {
  Text,
  FlatList,
  Spinner,
  Avatar,
  Flex,
  Box,
  VStack,
  Spacer,
  Heading,
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

export function RatingsScreen(props: Props) {
  const { user } = useUser();

  const { data, loading, error } = useQuery<GetRatingsQuery>(Ratings, {
    variables: { id: user?.id },
  });

  const ratings = data?.getRatings;

  const renderItem = ({ item, index }: { item: Rating, index: number }) => {
    const otherUser = user?.id === item.rater.id ? item.rated : item.rater;

    return (
      <Pressable
        onPress={() => props.navigation.push("Profile", { id: otherUser.id })}
      >
        <Box
          mx={4}
          my={2}
          px={4}
          py={4}
          mt={index === 0 ? 4 : undefined}
          _light={{ bg: "coolGray.100" }}
          _dark={{ bg: "gray.900" }}
          rounded="lg"
        >
          <Flex direction="row" alignItems="center" p={2}>
            <Avatar
              size={50}
              mr={4}
              source={{
                uri: otherUser.photoUrl ? otherUser.photoUrl : undefined,
              }}
            />
            <VStack space={4}>
              <Text>
                {user?.id === item.rater.id ? (
                  <Flex direction="row" alignItems="center">
                    <Text _dark={{ color: "white" }} fontSize="md">
                      You rated
                    </Text>{" "}
                    <Text bold fontSize="md" _dark={{ color: "white" }}>
                      {otherUser.name}
                    </Text>
                  </Flex>
                ) : (
                  <Flex direction="row" alignItems="center">
                    <Text bold fontSize="md" _dark={{ color: "white" }}>
                      {otherUser.name}
                    </Text>{" "}
                    <Text fontSize="md" _dark={{ color: "white" }}>
                      rated you
                    </Text>
                  </Flex>
                )}
              </Text>
              <Text>{printStars(item.stars)}</Text>
              {item.message && <Text>{item.message}</Text>}
            </VStack>
            <Spacer />
          </Flex>
        </Box>
      </Pressable>
    );
  };

  if (loading) {
    return (
      <Container alignItems="center" justifyContent="center">
        <Text>Loading your ratings</Text>
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

  if (ratings && ratings.items.length > 0) {
    return (
      <Container alignItems="center" justifyContent="center">
        <FlatList
          w="100%"
          data={ratings.items as unknown as Rating[]}
          renderItem={renderItem}
        />
      </Container>
    );
  }

  return (
    <Container alignItems="center" justifyContent="center">
      <Heading fontWeight="extrabold">Nothing to display!</Heading>
      <Text>You have no ratings to display</Text>
    </Container>
  );
}
