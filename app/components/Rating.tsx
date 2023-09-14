import React from "react";
import { useNavigation } from "@react-navigation/native";
import { HStack, Spacer, Stack, Text } from "native-base";
import { GetRatingsQuery } from "../generated/graphql";
import { useUser } from "../utils/useUser";
import { Avatar } from "./Avatar";
import { printStars } from "./Stars";
import { Unpacked } from "../utils/constants";
import { Card } from "./Card";
import { router } from "expo-router";

interface Props {
  item: Unpacked<GetRatingsQuery["getRatings"]["items"]>;
  index: number;
}

export function Rating(props: Props) {
  const { item } = props;
  const { user } = useUser();
  const otherUser = user?.id === item.rater.id ? item.rated : item.rater;

  const isRater = user?.id === item.rater.id;
  const isRated = user?.id === item.rated.id;

  return (
    <Card
      mt={2}
      mx={1}
      pressable
      onPress={() => router.push({ pathname: "/user/[id]/", params: { id: otherUser.id } })}
    >
      <Stack space={2}>
        <HStack alignItems="center" space={2}>
          <Avatar size={12} url={otherUser.photo} />
          <Stack flexShrink={1}>
            <Text
              fontSize="xl"
              letterSpacing="sm"
              fontWeight="extrabold"
              isTruncated
            >
              {otherUser.name}
            </Text>
            <Text color="gray.400" fontSize="xs" isTruncated>
              {`${isRater ? "Rated" : "Recieved"} - ${new Date(
                item.timestamp
              ).toLocaleString(undefined, { dateStyle: 'short', timeStyle: "short" })}`}
            </Text>
          </Stack>
          <Spacer />
          <Text>{printStars(item.stars)}</Text>
        </HStack>
        {item.message && <Text>{item.message}</Text>}
      </Stack>
    </Card>
  );
}
