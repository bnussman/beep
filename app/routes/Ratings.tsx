import React from "react";
import { FlatList, RefreshControl, useColorScheme } from "react-native";
import { useUser } from "../utils/useUser";
import { useQuery } from "@apollo/client";
import { Container } from "../components/Container";
import { Rating } from "../components/Rating";
import { PAGE_SIZE } from "../utils/constants";
import { graphql } from "gql.tada";
import {
  Text,
  Spinner,
  Heading,
  Stack,
} from "@beep/ui";

export const Ratings = graphql(`
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
`);

export function RatingsScreen() {
  const { user } = useUser();
  const colorMode = useColorScheme();

  const { data, loading, error, fetchMore, refetch } =
    useQuery(Ratings, {
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
      <Stack ai="center" jc="center">
        <Spinner />
      </Stack>
    );
  };

  if (loading && !ratings) {
    return (
      <Container center>
        <Spinner />
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
        <Heading fontWeight="bold">No Ratings</Heading>
        <Text>You have no ratings to display</Text>
      </Container>
    );
  }

  return (
    <Container>
      <FlatList
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
