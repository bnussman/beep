import React from "react";
import { useNavigation } from "@react-navigation/native";
import { HStack, Stack, Text } from "native-base";
import { GetBeepHistoryQuery } from "../generated/graphql";
import { Navigation } from "../utils/Navigation";
import { useUser } from "../utils/useUser";
import { Avatar } from "./Avatar";
import { Unpacked } from "../utils/constants";
import { Card } from "./Card";

interface Props {
  item: Unpacked<GetBeepHistoryQuery["getBeeps"]["items"]>;
  index: number;
}

export function Beep({ item, index }: Props) {
  const { user } = useUser();
  const navigation = useNavigation<Navigation>();
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
        <Avatar size={12} mr={2} url={otherUser.photo} />
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
}
