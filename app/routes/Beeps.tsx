import React from "react";
import { RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { gql, useQuery } from "@apollo/client";
import { GetBeepHistoryQuery } from "../generated/graphql";
import { Container } from "../components/Container";
import { Navigation } from "../utils/Navigation";
import { Unpacked } from "../utils/constants";
import { useUser } from "../utils/useUser";
import { Avatar } from "../components/Avatar";
import { Card } from "../components/Card";
import {
  Spinner,
  Text,
  FlatList,
  Heading,
  HStack,
  Center,
  useColorMode,
  Stack,
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

export function BeepsScreen() {
  const { user } = useUser();
  const { colorMode } = useColorMode();

  const navigation = useNavigation<Navigation>();

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

  const renderItem = ({
    item,
    index,
  }: {
    item: Unpacked<GetBeepHistoryQuery["getBeeps"]["items"]>;
    index: number;
  }) => {
    const otherUser = user?.id === item.rider.id ? item.beeper : item.rider;
    const isRider = user?.id === item.rider.id;
    return (
      <Card
        mx={2}
        my={2}
        mt={index === 0 ? 4 : undefined}
        pressable
        onPress={() =>
          navigation.push("Profile", { id: otherUser.id, beep: item.id })
        }
      >
        <HStack alignItems="center" mb={2}>
          <Avatar size={12} mr={2} url={otherUser.photoUrl} />
          <Stack>
            <Text fontSize="xl" fontWeight="extrabold">
              {otherUser.name}
            </Text>
            <Text color="gray.400" fontSize="xs">
              {`${isRider ? "Ride" : "Beep"} - ${new Date(
                item.start
              ).toLocaleString()}`}
            </Text>
          </Stack>
        </HStack>
        <Stack>
          <Text>
            <Text bold>Group size</Text> <Text>{item.groupSize}</Text>
          </Text>
          <Text>
            <Text bold>Pick Up</Text> <Text>{item.origin}</Text>
          </Text>
          <Text>
            <Text bold>Drop Off</Text> <Text>{item.destination}</Text>
          </Text>
        </Stack>
      </Card>
    );
  };

  if (loading && !data) {
    return (
      <Container alignItems="center" justifyContent="center">
        <Spinner size="lg" />
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

  return (
    <Container alignItems="center" justifyContent="center">
      <Heading fontWeight="extrabold">Nothing to display!</Heading>
      <Text>You have no previous beeps to display</Text>
    </Container>
  );
}
