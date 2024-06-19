import React from "react";
import * as DropdownMenu from "zeego/dropdown-menu";
import { useQuery } from "@apollo/client";
import { printStars } from "@/components/Stars";
import { Avatar } from "@/components/Avatar";
import { StaticScreenProps, useNavigation } from "@react-navigation/native";
import { graphql } from "gql.tada";
import { Text } from "@/components/Text";
import { ActivityIndicator, View } from "react-native";
import { trpc } from "@/utils/trpc";

export const GetUser = graphql(`
  query GetUserProfile($id: String!) {
    getUser(id: $id) {
      id
      name
      username
      name
      isBeeping
      isStudent
      role
      venmo
      cashapp
      singlesRate
      groupRate
      capacity
      photo
      queueSize
      rating
    }
  }
`);

type Props = StaticScreenProps<{ id: string; beepId?: string }>;

export function ProfileScreen({ route }: Props) {
  const { data: currentUser } = trpc.user.useQuery();
  const navigation = useNavigation();

  const { data, loading, error } = useQuery(GetUser, {
    variables: { id: route.params.id },
  });

  const user = data?.getUser;

  const handleReport = () => {
    navigation.navigate("Report", {
      userId: route.params.id,
      beepId: route.params.beepId,
    });
  };

  const handleRate = () => {
    if (!route.params.beepId) {
      alert("No beep to rate.");
    }

    navigation.navigate("Rate", {
      userId: route.params.id,
      beepId: route.params.beepId!,
    });
  };
  React.useLayoutEffect(() => {
    if (currentUser?.id !== route.params.id) {
      navigation.setOptions({
        headerRight: () => (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <Text size="3xl" className="mr-1">
                ⬇️
              </Text>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Item key="rate" onSelect={handleRate}>
                <DropdownMenu.ItemTitle>Rate</DropdownMenu.ItemTitle>
              </DropdownMenu.Item>
              <DropdownMenu.Item key="report" onSelect={handleReport}>
                <DropdownMenu.ItemTitle>Report</DropdownMenu.ItemTitle>
              </DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.Arrow />
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        ),
      });
    }
  }, [navigation, route.params, data]);

  if (loading) {
    return (
      <View className="flex h-full items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex h-full items-center justify-center">
        <Text>{error.message}</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View className="flex h-full items-center justify-center">
        <Text>User does not exist</Text>
      </View>
    );
  }

  return (
    <View className="p-4 flex gap-4">
      <View className="flex flex-row justify-between items-center">
        <View>
          <Text size="4xl" weight="black">
            {user.name}
          </Text>
          <Text color="subtle" className="mb-8">
            @{user.username}
          </Text>
        </View>
        <Avatar size="xl" src={user.photo ?? undefined} />
      </View>
      {user.isBeeping && (
        <>
          <Text weight="bold">Queue Size</Text>
          <Text>{user.queueSize}</Text>
        </>
      )}
      {user.venmo && (
        <Text>
          <Text weight="bold">Venmo </Text>
          <Text>@{user.venmo}</Text>
        </Text>
      )}
      {user.cashapp && (
        <Text>
          <Text weight="bold">Cash App </Text>
          <Text>@{user.cashapp}</Text>
        </Text>
      )}
      <Text>
        <Text weight="bold">Capacity </Text>
        <Text>{user.capacity}</Text>
      </Text>
      <Text>
        <Text weight="bold">Singles Rate </Text>
        <Text>${user.singlesRate}</Text>
      </Text>
      <Text>
        <Text weight="bold">Group Rate </Text>
        <Text>${user.groupRate}</Text>
      </Text>
      {user.rating && (
        <Text>
          <Text weight="bold">Rating </Text>
          <Text>{printStars(user.rating)}</Text>
        </Text>
      )}
    </View>
  );
}
