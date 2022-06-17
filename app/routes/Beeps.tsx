import React from "react";
import { Pressable, RefreshControl } from "react-native";
import { gql, useQuery } from "@apollo/client";
import { GetBeepHistoryQuery } from "../generated/graphql";
import { Container } from "../components/Container";
import { Navigation } from "../utils/Navigation";
import { Unpacked } from "../utils/constants";
import { useUser } from "../utils/useUser";
import {
  Spinner,
  Text,
  FlatList,
  Avatar,
  Box,
  Heading,
  HStack,
  Center,
  useColorMode,
} from "native-base";

interface Props {
  navigation: Navigation;
}

const GetBeepHistory = gql`
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
          photoUrl
        }
        beeper {
          id
          name
          first
          last
          photoUrl
        }
      }
      count
    }
  }
`;

export function BeepsScreen(props: Props) {
  const { user } = useUser();
  const { colorMode } = useColorMode();

  const { data, loading, error, fetchMore, refetch } = useQuery<GetBeepHistoryQuery>(
    GetBeepHistory,
    { variables: { id: user?.id, offset: 0, show: 10 }, notifyOnNetworkStatusChange: true }
  );

  const beeps = data?.getBeeps.items;
  const count = data?.getBeeps.count || 0;
  const isRefreshing = Boolean(data) && loading;
  const canLoadMore = beeps && count && (beeps?.length < count);

  const getMore = () => {
    if (!canLoadMore || isRefreshing) return;

    fetchMore({
      variables: {
        offset: beeps?.length || 0,
        limit: 10
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return prev;
        }

        return {
          getBeeps: {
            items: [...prev.getBeeps.items, ...fetchMoreResult.getBeeps.items],
            count: fetchMoreResult.getBeeps.count
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

  const renderItem = ({
    item,
    index,
  }: {
    item: Unpacked<GetBeepHistoryQuery["getBeeps"]["items"]>;
    index: number,
  }) => {
    const otherUser = user?.id === item.rider.id ? item.beeper : item.rider;
    return (
      <Pressable
        onPress={() =>
          props.navigation.push("Profile", { id: otherUser.id, beep: item.id })
        }
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
          <HStack alignItems="center">
            <Avatar
              size={35}
              mr={2}
              source={{
                uri: otherUser.photoUrl ? otherUser.photoUrl : undefined,
              }}
            />
            <Heading size="md">
              {user?.id === item.rider.id
                ? `${otherUser.name} beeped you`
                : `You beeped ${otherUser.name}`}
            </Heading>
          </HStack>
          <Text>
            <Text bold>Group size:</Text> <Text>{item.groupSize}</Text>
          </Text>
          <Text>
            <Text bold>Pick Up:</Text> <Text>{item.origin}</Text>
          </Text>
          <Text>
            <Text bold>Drop Off:</Text> <Text>{item.destination}</Text>
          </Text>
          <Text>
            <Text bold>Date:</Text>{" "}
            <Text>{new Date(item.start).toLocaleString()}</Text>
          </Text>
        </Box>
      </Pressable>
    );
  };

  if (loading && !data) {
    return (
      <Container alignItems="center" justifyContent="center">
        <Text>Loading your history</Text>
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

  if (beeps && beeps.length > 0) {
    return (
      <Container alignItems="center" justifyContent="center">
        <FlatList
          w="100%"
          data={beeps}
          renderItem={renderItem}
          keyExtractor={beep => beep.id}
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
      <Text>You have no previous beeps to display</Text>
    </Container>
  );
}
