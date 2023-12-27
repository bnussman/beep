import React from "react";
import { RefreshControl, useColorScheme } from "react-native";
import { useUser } from "../utils/useUser";
import { gql, useQuery } from "@apollo/client";
import { GetRatingsQuery } from "../generated/graphql";
import { Container } from "../components/Container";
import { Rating } from "../components/Rating";
import { PAGE_SIZE } from "../utils/constants";
import {
  Text,
  Spinner,
  Heading,
  H1,
} from "tamagui";
import { FlatList } from "react-native";

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
          photo
        }
        rated {
          id
          name
          photo
        }
        beep {
          id
        }
      }
      count
    }
  }
`;

export function RatingsScreen() {
  const { user } = useUser();
  const colorMode = useColorScheme();

  const { data, loading, error, fetchMore, refetch } =
    useQuery<GetRatingsQuery>(Ratings, {
      variables: { id: user?.id, offset: 0, show: PAGE_SIZE },
      notifyOnNetworkStatusChange: true,
    });

  const ratings = data?.getRatings.items;
  const count = data?.getRatings.count || 0;
  const isRefreshing = Boolean(data) && loading;
  const canLoadMore = ratings && count && ratings?.length < count;

  const getMore = () => {
    if (!canLoadMore || isRefreshing) return;

    fetchMore({
      variables: {
        offset: ratings?.length || 0,
        limit: PAGE_SIZE,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return prev;
        }

        return {
          getRatings: {
            items: [
              ...prev.getRatings.items,
              ...fetchMoreResult.getRatings.items,
            ],
            count: fetchMoreResult.getRatings.count,
          },
        };
      },
    });
  };

  const renderFooter = () => {
    if (!isRefreshing) return null;

    if (!count || count < PAGE_SIZE) return null;

    return (
      <Container center>
        <Spinner mt={4} mb={9} color="gray.400" />
      </Container>
    );
  };

  if (loading && !ratings) {
    return (
      <Container center>
        <Spinner size="large" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container center>
        <Text>{error.message}</Text>
      </Container>
    );
  }

  if (ratings?.length === 0) {
    return (
      <Container center>
        <H1>No Ratings</H1>
        <Text>You have no ratings to display</Text>
      </Container>
    );
  }

  return (
    <Container>
      <FlatList
        contentContainerStyle={colorMode === "dark" ? { backgroundColor: 'black' } : {}}
        data={ratings}
        renderItem={(data) => <Rating {...data} />}
        keyExtractor={(rating) => rating.id}
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
