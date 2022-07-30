import React from "react";
import { RefreshControl } from "react-native";
import { useUser } from "../utils/useUser";
import { gql, useQuery } from "@apollo/client";
import { GetRatingsQuery } from "../generated/graphql";
import { Container } from "../components/Container";
import { Rating } from "../components/Rating";
import {
  Text,
  FlatList,
  Spinner,
  Heading,
  Center,
  useColorMode,
} from "native-base";

export const Ratings = gql`
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

export function RatingsScreen() {
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
          data={ratings}
          renderItem={({ item, index }) => <Rating item={item} index={index} />}
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
