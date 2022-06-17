import React from "react";
import { Pressable, RefreshControl } from "react-native";
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
  Center,
  useColorMode,
} from "native-base";

interface Props {
  navigation: Navigation;
}

const Ratings = gql`
  query GetRatings($id: String, $offset: Int, $show: Int) {
    getRatings(id: $id, offset: $offset, show: $show) {
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
  const { colorMode } = useColorMode();

  const { data, loading, error, fetchMore, refetch } = useQuery<GetRatingsQuery>(Ratings, {
    variables: { id: user?.id, offset: 0, show: 10 },
    notifyOnNetworkStatusChange: true,
  });

  const ratings = data?.getRatings.items;
  const count = data?.getRatings.count || 0;
  const isRefreshing = Boolean(data) && loading;
  const canLoadMore = ratings && count && (ratings?.length < count);

  const getMore = () => {
    if (!canLoadMore || isRefreshing) return;

    fetchMore({
      variables: {
        offset: ratings?.length || 0,
        limit: 10
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return prev;
        }

        return {
          getRatings: {
            items: [...prev.getRatings.items, ...fetchMoreResult.getRatings.items],
            count: fetchMoreResult.getRatings.count
          }
        };
      }
    });
  };

  const renderFooter = () => {
    if (!isRefreshing) return null;

    return (
      <Center>
        <Spinner mt={4} mb={9} color="gray.400" />
      </Center>
    );
  };

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

  if (loading && !data) {
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

  if (ratings && ratings.length > 0) {
    return (
      <Container alignItems="center" justifyContent="center">
        <FlatList
          w="100%"
          data={ratings as unknown as Rating[]}
          renderItem={renderItem}
          keyExtractor={rating => rating.id}
          onEndReached={getMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter()}
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

  return (
    <Container alignItems="center" justifyContent="center">
      <Heading fontWeight="extrabold">Nothing to display!</Heading>
      <Text>You have no ratings to display</Text>
    </Container>
  );
}
