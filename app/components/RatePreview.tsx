import React from "react";
import { gql, useQuery } from "@apollo/client";
import { GetRatingsForUserQuery, GetRatingsQuery } from "../generated/graphql";
import { Avatar } from "./Avatar";
import { printStars } from "./Stars";
import { Card } from "./Card";
import { RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Navigation } from "../utils/Navigation";
import {
  Text,
  HStack,
  Stack,
  Heading,
  Center,
  Spinner,
  FlatList,
  useColorMode,
  Spacer,
} from "native-base";

const Ratings = gql`
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
`;

interface Props {
  id: string;
}

const PAGE_SIZE = 5;

export function RatePreview({ id }: Props) {
  const { colorMode } = useColorMode();
  const { push } = useNavigation<Navigation>();
  const { data, loading, error, fetchMore, refetch } =
    useQuery<GetRatingsForUserQuery>(Ratings, {
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
      <Center>
        <Spinner mt={4} mb={9} color="gray.400" />
      </Center>
    );
  };

  if (loading && !ratings) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  if (error) {
    return (
      <Center>
        <Text>{error.message}</Text>
      </Center>
    );
  }

  return (
    <Card flexShrink={1}>
      <HStack alignItems="center">
        <Heading fontWeight="extrabold">Ratings</Heading>
        <Spacer />
        <Heading size="xs" color="gray.400">
          {count} ratings
        </Heading>
      </HStack>
      <FlatList
        data={ratings}
        renderItem={({ item: rating }) => (
          <Card
            key={rating.id}
            p={1}
            mt={2}
            pressable
            onPress={() => push("Profile", { id: rating.rater.id, beepId: rating.beep.id })}
          >
            <HStack alignItems="center" p={2}>
              <Avatar size="md" mr={4} url={rating.rater.photo} />
              <Stack>
                <Text fontWeight="extrabold" fontSize="lg" letterSpacing="xs">
                  {rating.rater.name}
                </Text>
                <Text color="gray.400" fontSize="xs" mb={1}>
                  {new Date(rating.timestamp).toLocaleString()}
                </Text>
                <Text fontSize="xs">{printStars(rating.stars)}</Text>
                {rating.message ? (
                  <Text fontSize="xs">{rating.message}</Text>
                ) : null}
              </Stack>
            </HStack>
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
