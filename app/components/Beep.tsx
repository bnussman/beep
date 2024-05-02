import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Card, XStack, Stack, Text } from "@beep/ui";
import { useUser } from "../utils/useUser";
import { Avatar } from "./Avatar";
import { Unpacked } from "../utils/constants";
import { Status } from "../utils/types";
import { ResultOf } from "gql.tada";
import { GetBeepHistory } from "../routes/Beeps";

interface Props {
  item: Unpacked<ResultOf<typeof GetBeepHistory>["getBeeps"]["items"]>;
  index: number;
}

export const beepStatusMap: Record<Status, string> = {
  [Status.WAITING]: "$orange9",
  [Status.ON_THE_WAY]: "$orange9",
  [Status.ACCEPTED]: "$green9",
  [Status.IN_PROGRESS]: "$green9",
  [Status.HERE]: "$green9",
  [Status.DENIED]: "$red9",
  [Status.CANCELED]: "$red9",
  [Status.COMPLETE]: "$green9",
};

export function Beep({ item }: Props) {
  const { user } = useUser();
  const navigation = useNavigation();
  const otherUser = user?.id === item.rider.id ? item.beeper : item.rider;
  const isRider = user?.id === item.rider.id;

  return (
    <Card
      mt="$2"
      mx="$2"
      p="$4"
      pressTheme
      hoverTheme
      onPress={() =>
        navigation.navigate("User", { id: otherUser.id, beepId: item.id })
      }
    >
      <XStack alignItems="center" mb="$2">
        <Avatar size="sm" src={otherUser.photo ?? undefined} className="mr-2" />
        <Stack flexShrink={1}>
          <Text fontWeight="bold">{otherUser.name}</Text>
          <Text color="$gray10">
            {`${isRider ? "Ride" : "Beep"} - ${new Date(
              item.start as string,
            ).toLocaleString()}`}
          </Text>
        </Stack>
        <Stack flexGrow={1} />
        <Card
          backgroundColor={beepStatusMap[item.status as Status]}
          borderRadius="$4"
          px="$1.5"
        >
          <Text
            textTransform="capitalize"
            color="white"
            fontWeight="bold"
            fontSize="$2"
          >
            {item.status}
          </Text>
        </Card>
      </XStack>
      <Stack>
        <Text>
          <Text fontWeight="bold">Group size</Text>{" "}
          <Text>{item.groupSize}</Text>
        </Text>
        <Text>
          <Text fontWeight="bold">Pick Up</Text> <Text>{item.origin}</Text>
        </Text>
        <Text>
          <Text fontWeight="bold">Drop Off</Text>{" "}
          <Text>{item.destination}</Text>
        </Text>
      </Stack>
    </Card>
  );
}
