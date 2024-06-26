import React from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Card } from "@/components/Card";
import { Text } from "@/components/Text";
import { Avatar } from "@/components/Avatar";
import { useUser } from "../utils/useUser";
import { Unpacked } from "../utils/constants";
import { Status } from "../utils/types";
import { ResultOf } from "gql.tada";
import { GetBeepHistory } from "../routes/Beeps";
import { cx } from "class-variance-authority";
import * as ContextMenu from "zeego/context-menu";
import { openVenmo } from "@/utils/links";

interface Props {
  item: Unpacked<ResultOf<typeof GetBeepHistory>["getBeeps"]["items"]>;
  index: number;
}

export function Beep({ item }: Props) {
  const { user } = useUser();
  const navigation = useNavigation();
  const otherUser = user?.id === item.rider.id ? item.beeper : item.rider;
  const isRider = user?.id === item.rider.id;
  const isBeeper = user?.id === item.beeper.id;

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger action="press">
        <Card className="p-4 gap-2" variant="outlined" pressable>
          <View className="flex flex-row items-center gap-2">
            <Avatar size="xs" src={otherUser.photo ?? undefined} />
            <View className="flex-shrink">
              <Text weight="bold" size="lg">
                {otherUser.name}
              </Text>
              <Text color="subtle" size="sm">
                {`${isRider ? "Ride" : "Beep"} - ${new Date(
                  item.start as string,
                ).toLocaleString()}`}
              </Text>
            </View>
            {/* <View className="flex-grow" />
            <Text size="xl">{STATUS_TO_EMOJI[item.status as Status]}</Text > */}
          </View>
          <View>
            <Text>
              <Text weight="bold">Group size</Text> <Text>{item.groupSize}</Text>
            </Text>
            <Text>
              <Text weight="bold">Pick Up</Text> <Text>{item.origin}</Text>
            </Text>
            <Text>
              <Text weight="bold">Drop Off</Text> <Text>{item.destination}</Text>
            </Text>
          </View>
        </Card>
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        {isRider && item.beeper.venmo && (
          <ContextMenu.Item
            key="pay-beeper"
            onSelect={() => openVenmo(item.beeper.venmo, item.groupSize, item.beeper.groupRate, item.beeper.singlesRate, "pay")}
          >
            <ContextMenu.ItemTitle>Pay Beeper with Venmo</ContextMenu.ItemTitle>
          </ContextMenu.Item>
        )}
        {isBeeper && item.rider.venmo && (
          <ContextMenu.Item
            key="request-rider"
            onSelect={() => openVenmo(item.rider.venmo, item.groupSize, item.beeper.groupRate, item.beeper.singlesRate, "charge")}
          >
            <ContextMenu.ItemTitle>Charge Rider with Venmo</ContextMenu.ItemTitle>
          </ContextMenu.Item>
        )}
        <ContextMenu.Item
          key="rate"
          onSelect={() => navigation.navigate("Rate", { userId: otherUser.id, beepId: item.id })}
        >
          <ContextMenu.ItemTitle>Rate</ContextMenu.ItemTitle>
        </ContextMenu.Item>
        <ContextMenu.Item
          key="report"
          onSelect={() => navigation.navigate("Report", { userId: otherUser.id, beepId: item.id })}
        >
          <ContextMenu.ItemTitle>Report</ContextMenu.ItemTitle>
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}

const STATUS_TO_EMOJI: Record<Status, string> = {
  [Status.ACCEPTED]: "☑️",
  [Status.CANCELED]: "❌",
  [Status.DENIED]: "⛔",
  [Status.WAITING]: "⏳",
  [Status.ON_THE_WAY]: "🚙",
  [Status.HERE]: "📍",
  [Status.IN_PROGRESS]: "🚙",
  [Status.COMPLETE]: "✅"
};
