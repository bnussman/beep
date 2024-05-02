import React from "react";
import { useQuery } from "@apollo/client";
import { Avatar } from "../../components/Avatar";
import { printStars } from "../../components/Stars";
import { FlatList, RefreshControl, useColorScheme } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { graphql } from "gql.tada";
import { Text, Card, XStack, Stack, Heading, Spinner } from "@beep/ui";

const Ratings = graphql(`
  query GetRatingsForUser($id: String, $offset: Int, $show: Int) {
    getRatings(id: $id, show: $show, offset: $offset, filter: "recieved") {
      items {
        id
        timestamp
        message
        stars
        rater {
          id
          name
          photo
          username
        }
        rated {
          id
          name
          photo
          username
        }
        beep {
          id
        }
      }
      count
    }
  }
`);

interface Props {
  id: string;
}

const PAGE_SIZE = 5;

export function RatePreview({ id }: Props) {
  const colorMode = useColorScheme();
  const { navigate } = useNavigation();
  const { data, loading, error, fetchMore, refetch } = useQuery(Ratings, {
    variables: { id, offset: 0, show: PAGE_SIZE },
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
      <Stack ai="center" jc="center">
        <Spinner />
      </Stack>
    );
  }

  if (error) {
    return (
      <Stack ai="center" jc="center">
        <Text>{error.message}</Text>
      </Stack>
    );
  }

  return (
    <Card flexShrink={1} p="$3">
      <XStack alignItems="center" jc="space-between">
        <Heading fontWeight="bold">Ratings</Heading>
        <Text>{count} ratings</Text>
      </XStack>
      <FlatList
        data={ratings}
        renderItem={({ item: rating }) => (
          <Card
            key={rating.id}
            px="$3"
            py="$2"
            mt="$2"
            pressTheme
            hoverTheme
            onPress={() =>
              navigate("User", { id: rating.rater.id, beepId: rating.beep.id })
            }
          >
            <XStack alignItems="center">
              <Avatar
                size="sm"
                className="mr-2"
                src={rating.rater.photo ?? undefined}
              />
              <Stack>
                <Text fontWeight="bold">{rating.rater.name}</Text>
                <Text color="$gray10" fontSize="$2" mb="$1">
                  {new Date(rating.timestamp as string).toLocaleString()}
                </Text>
                <Text fontSize="$1">{printStars(rating.stars)}</Text>
                {rating.message && <Text fontSize="$1">{rating.message}</Text>}
              </Stack>
            </XStack>
          </Card>
        )}
        keyExtractor={(beep) => beep.id}
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
    </Card>
  );
}
