import React from "react";
import { gql, useQuery } from "@apollo/client";
import { GetRatingsForUserQuery } from "../../generated/graphql";
import { Avatar } from "../../components/Avatar";
import { printStars } from "../../components/Stars";
import { Card } from "../../components/Card";
import { FlatList, RefreshControl, useColorScheme } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  Text,
  XStack,
  Stack,
  Heading,
  Spinner,
  Spacer,
  H2,
  SizableText,
  H3,
} from "tamagui";
import { Container } from "../../components/Container";

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
  const colorMode = useColorScheme();
  const { navigate } = useNavigation();
  
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
      <Container center>
        <Spinner mt={4} mb={9} color="gray.400" />
      </Container>
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
        <SizableText>{error.message}</SizableText>
      </Container>
    );
  }

  return (
    <Card flexShrink={1}>
      <XStack alignItems="center" justifyContent="space-between">
        <H3 fontWeight="bold">Ratings</H3>
        <SizableText>
          {count} ratings
        </SizableText>
      </XStack>
      <FlatList
        data={ratings}
        renderItem={({ item: rating }) => (
          <Card
            key={rating.id}
            p="$2"
            mt="$2"
            pressable
            onPress={() => navigate("User", { id: rating.rater.id, beepId: rating.beep.id })}
          >
            <XStack alignItems="center">
              <Avatar size="$6" mr="$2" url={rating.rater.photo} />
              <Stack>
                <SizableText fontWeight="bold" fontSize="$4">
                  {rating.rater.name}
                </SizableText>
                <SizableText color="$gray9" fontSize="$1">
                  {new Date(rating.timestamp).toLocaleString()}
                </SizableText>
                <SizableText fontSize="$1">{printStars(rating.stars)}</SizableText>
                {rating.message && (
                  <SizableText size="$2">{rating.message}</SizableText>
                )}
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
