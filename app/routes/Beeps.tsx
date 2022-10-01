import React from "react";
import { RefreshControl } from "react-native";
import { gql, useQuery } from "@apollo/client";
import { GetBeepHistoryQuery } from "../generated/graphql";
import { Container } from "../components/Container";
import { useUser } from "../utils/useUser";
import { Beep } from "../components/Beep";
import {
  Spinner,
  Text,
  FlatList,
  Heading,
  Center,
  useColorMode,
} from "native-base";

export const GetBeepHistory = gql`
  query GetBeepHistory($id: String, $offset: Int, $show: Int) {
    getBeeps(id: $id, offset: $offset, show: $show) {
      items {
        id
        start
        end
        groupSize
        origin
        destination
        rider {
          id
          name
          first
          last
          photo
        }
        beeper {
          id
          name
          first
          last
          photo
        }
      }
      count
    }
  }
`;

export function BeepsScreen() {
  const { user } = useUser();
  const { colorMode } = useColorMode();

  const { data, loading, error, fetchMore, refetch } =
    useQuery<GetBeepHistoryQuery>(GetBeepHistory, {
      variables: { id: user?.id, offset: 0, show: 10 },
      notifyOnNetworkStatusChange: true,
    });

  const beeps = data?.getBeeps.items;
  const count = data?.getBeeps.count || 0;
  const isRefreshing = Boolean(data) && loading;
  const canLoadMore = beeps && count && beeps?.length < count;

  const getMore = () => {
    if (!canLoadMore || isRefreshing) return;

    fetchMore({
      variables: {
        offset: beeps?.length || 0,
        limit: 10,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return prev;
        }

        return {
          getBeeps: {
            items: [...prev.getBeeps.items, ...fetchMoreResult.getBeeps.items],
            count: fetchMoreResult.getBeeps.count,
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

  if (loading && !beeps) {
    return (
      <Container center>
        <Spinner size="lg" />
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

  if (beeps?.length === 0) {
    return (
      <Container center>
        <Heading fontWeight="extrabold">Nothing to display!</Heading>
        <Text>You have no previous beeps to display</Text>
      </Container>
    );
  }

  return (
    <Container>
      <FlatList
        w="100%"
        data={beeps}
        renderItem={({ item, index }) => <Beep item={item} index={index} />}
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
    </Container>
  );
}
