import React from "react";
import { gql, useQuery } from "@apollo/client";
import { GetRatingsQuery } from "../../generated/graphql";
import { Avatar } from "../../components/Avatar";
import { printStars } from "../../components/Stars";
import { Card } from "../../components/Card";
import { RefreshControl } from "react-native";
import {
  Text,
  HStack,
  Stack,
  Heading,
  Center,
  Spinner,
  FlatList,
  useColorMode,
} from "native-base";
import { useNavigation } from "@react-navigation/native";
import { Navigation } from "../../utils/Navigation";

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
          photoUrl
          username
        }
        rated {
          id
          name
          photoUrl
          username
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
  const { data, loading, fetchMore, refetch } = useQuery<GetRatingsQuery>(
    Ratings,
    {
      variables: { id, offset: 0, show: PAGE_SIZE },
      notifyOnNetworkStatusChange: true,
    }
  );

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

    return (
      <Center>
        <Spinner mt={4} mb={9} color="gray.400" />
      </Center>
    );
  };

  if (!ratings || !count || count === 0) {
    return null;
  }

  return (
    <>
      <Heading mt={6}>Ratings</Heading>
      <FlatList
        w="100%"
        data={ratings}
        renderItem={({ item: rating }) => (
          <Card
            key={rating.id}
            p={2}
            my={2}
            pressable
            onPress={() => push("Profile", { id: rating.rater.id })}
          >
            <HStack alignItems="center" p={2}>
              <Avatar size="lg" mr={4} url={rating.rater.photoUrl} />
              <Stack>
                <Text fontWeight="extrabold" fontSize="lg">
                  {rating.rater.name}
                </Text>
                <Text color="gray.400" fontSize="xs" mb={1}>
                  {new Date(rating.timestamp).toLocaleString()}
                </Text>
                <Text fontSize="xs">{printStars(rating.stars)}</Text>
              </Stack>
            </HStack>
            {rating.message ? <Text>{rating.message}</Text> : null}
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
    </>
  );
}
