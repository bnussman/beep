import React from "react";
import { useNavigation } from "@react-navigation/native";
import { XStack, SizableText, Stack, SizableTextProps } from "tamagui";
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

export const beepStatusMap: Record<Status, SizableTextProps['color']> = {
  [Status.WAITING]: "$orange4",
  [Status.ON_THE_WAY]: "$orange4",
  [Status.ACCEPTED]: "$green5",
  [Status.IN_PROGRESS]: "$green5",
  [Status.HERE]: "$green5",
  [Status.DENIED]: "$red5",
  [Status.CANCELED]: "$red9",
  [Status.COMPLETE]: "$green5",
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
      pressable
      onPress={() =>
        navigation.navigate("User", { id: otherUser.id, beepId: item.id })
      }
      mx="$2"
      my={1}
      mt={6}
    >
      <XStack alignItems="center" mb={2} space="$2">
        <Avatar size="$4" url={otherUser.photo} />
        <Stack flexGrow={1} space={0}>
          <SizableText fontWeight="bold">
            {otherUser.name}
          </SizableText>
          <SizableText>
            {`${isRider ? "Ride" : "Beep"} - ${new Date(
              item.start
            ).toLocaleString()}`}
          </SizableText>
        </Stack>
        {showBadge && (
          <Stack
            bg={beepStatusMap[item.status as Status]}
            borderRadius="$3"
            px="$2"
          >
            <SizableText color="white" fontSize="$1" textTransform="capitalize">
              {item.status}
            </SizableText>
          </Stack>
        )}
      </XStack>
      <Stack>
        <SizableText>
          <SizableText fontWeight="bold">Group size</SizableText> <SizableText>{item.groupSize}</SizableText>
        </SizableText>
        <SizableText>
          <SizableText fontWeight="bold">Pick Up</SizableText> <SizableText>{item.origin}</SizableText>
        </SizableText>
        <SizableText>
          <SizableText fontWeight="bold">Drop Off</SizableText> <SizableText>{item.destination}</SizableText>
        </SizableText>
      </Stack>
    </Card>
  );
}
