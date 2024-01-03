import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Badge, HStack, Spacer, Stack, Text } from "native-base";
import { GetBeepHistoryQuery } from "../generated/graphql";
import { useUser } from "../utils/useUser";
import { Avatar } from "./Avatar";
import { Unpacked } from "../utils/constants";
import { Card } from "./Card";
import { Status } from "../utils/types";

interface Props {
  item: Unpacked<GetBeepHistoryQuery["getBeeps"]["items"]>;
  index: number;
}

export const beepStatusMap: Record<Status, string> = {
  [Status.WAITING]: "orange.400",
  [Status.ON_THE_WAY]: "orange.400",
  [Status.ACCEPTED]: "green.500",
  [Status.IN_PROGRESS]: "green.500",
  [Status.HERE]: "green.500",
  [Status.DENIED]: "red.400",
  [Status.CANCELED]: "red.400",
  [Status.COMPLETE]: "green.500",
};

export function Beep({ item }: Props) {
  const { user } = useUser();
  const navigation = useNavigation();
  const otherUser = user?.id === item.rider.id ? item.beeper : item.rider;
  const isRider = user?.id === item.rider.id;

  const showBadge = [Status.CANCELED, Status.DENIED].includes(
    item.status as Status
  );

  return (
    <Card
      mt={2}
      mx={1}
      pressable
      onPress={() =>
        navigation.navigate("User", { id: otherUser.id, beepId: item.id })
      }
    >
      <HStack alignItems="center" mb={2}>
        <Avatar size={12} mr={2} url={otherUser.photo} />
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
            {`${isRider ? "Ride" : "Beep"} - ${new Date(
              item.start
            ).toLocaleString()}`}
          </Text>
        </Stack>
        <Spacer />
        {showBadge && (
          <Badge
            variant="solid"
            bg={beepStatusMap[item.status as Status]}
            borderRadius="lg"
            _text={{ textTransform: "capitalize", fontWeight: "bold" }}
          >
            {item.status}
          </Badge>
        )}
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
}
