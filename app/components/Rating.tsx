import React from "react";
import { useNavigation } from "@react-navigation/native";
import { HStack, Stack, Text } from "native-base";
import { GetRatingsQuery } from "../generated/graphql";
import { Navigation } from "../utils/Navigation";
import { useUser } from "../utils/useUser";
import { Avatar } from "./Avatar";
import { printStars } from "./Stars";
import { Unpacked } from "../utils/constants";
import { Card } from "./Card";

interface Props {
  item: Unpacked<GetRatingsQuery["getRatings"]["items"]>;
  index: number;
}

export function Rating(props: Props) {
  const { item, index } = props;
  const { user } = useUser();
  const navigation = useNavigation<Navigation>();
  const otherUser = user?.id === item.rater.id ? item.rated : item.rater;

  return (
    <Card
      mx={2}
      my={2}
      mt={index === 0 ? 4 : undefined}
      pressable
      onPress={() => navigation.push("Profile", { id: otherUser.id })}
    >
      <HStack alignItems="center" space={4}>
        <Avatar size="lg" url={otherUser.photo} />
        <Stack space={1}>
          {user?.id === item.rater.id ? (
            <Text>
              <Text fontSize="md">You rated</Text>{" "}
              <Text fontWeight="extrabold" fontSize="md">
                {otherUser.name}
              </Text>
            </Text>
          ) : (
            <Text>
              <Text fontWeight="extrabold" fontSize="md">
                {otherUser.name}
              </Text>{" "}
              <Text fontSize="md">rated you</Text>
            </Text>
          )}
          <Text color="gray.400" fontSize="xs">
            {new Date(item.timestamp).toLocaleString()}
          </Text>
          <Text>{printStars(item.stars)}</Text>
          {item.message && <Text>{item.message}</Text>}
        </Stack>
      </HStack>
    </Card>
  );
}
