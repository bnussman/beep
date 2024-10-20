import React from "react";
import * as ContextMenu from "zeego/context-menu";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Card } from "@/components/Card";
import { Text } from "@/components/Text";
import { Avatar } from "@/components/Avatar";
import { useUser } from "../utils/useUser";
import { Status } from "../utils/types";
import { openVenmo } from "@/utils/links";
import { RouterOutput } from "@/utils/trpc";
import { printStars } from "./Stars";

interface Props {
  item: RouterOutput["beep"]["beeps"]["beeps"][number];
  index: number;
}

export function Beep({ item }: Props) {
  const { user } = useUser();
  const navigation = useNavigation();
  const otherUser = user?.id === item.rider.id ? item.beeper : item.rider;
  const isRider = user?.id === item.rider.id;
  const isBeeper = user?.id === item.beeper.id;

  const myRating = item.ratings.find((r) => r.rater_id === user?.id);
  const otherUsersRating = item.ratings.find(
    (r) => r.rater_id === otherUser.id,
  );
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger action="press">
        <Card className="p-4 gap-2" variant="outlined" pressable>
          <View className="flex flex-row items-center gap-2">
            <Avatar size="xs" src={otherUser.photo ?? undefined} />
            <View className="flex-shrink">
              <Text weight="bold" size="lg">
                {otherUser.first} {otherUser.last}
              </Text>
              <Text color="subtle" size="sm">
                {`${isRider ? "Ride" : "Beep"} - ${new Date(
                  item.start as string,
                ).toLocaleString()}`}
              </Text>
            </View>
          </View>
          <View>
            <View className="flex flex-row justify-between">
              <Text weight="bold">Group size</Text>
              <Text>{item.groupSize}</Text>
            </View>
            <View className="flex flex-row justify-between gap-12">
              <Text weight="bold">Pick Up</Text>
              <Text className="flex-shrink text-right">{item.origin}</Text>
            </View>
            <View className="flex flex-row justify-between gap-12">
              <Text weight="bold">Drop Off</Text>
              <Text>{item.destination}</Text>
            </View>
            <View className="flex flex-row justify-between gap-12">
              <Text weight="bold">Your Rating</Text>
              <Text>{myRating ? printStars(myRating.stars) : "N/A"}</Text>
            </View>
            <View className="flex flex-row justify-between gap-12">
              <Text weight="bold">{otherUser.first}'s Rating</Text>
              <Text>
                {otherUsersRating ? printStars(otherUsersRating.stars) : "N/A"}
              </Text>
            </View>
          </View>
        </Card>
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        {isRider && item.beeper.venmo && (
          <ContextMenu.Item
            key="pay-beeper"
            onSelect={() =>
              openVenmo(
                item.beeper.venmo,
                item.groupSize,
                item.beeper.groupRate,
                item.beeper.singlesRate,
                "pay",
              )
            }
          >
            <ContextMenu.ItemTitle>Pay Beeper with Venmo</ContextMenu.ItemTitle>
          </ContextMenu.Item>
        )}
        {isBeeper && item.rider.venmo && (
          <ContextMenu.Item
            key="request-rider"
            onSelect={() =>
              openVenmo(
                item.rider.venmo,
                item.groupSize,
                item.beeper.groupRate,
                item.beeper.singlesRate,
                "charge",
              )
            }
          >
            <ContextMenu.ItemTitle>
              Charge Rider with Venmo
            </ContextMenu.ItemTitle>
          </ContextMenu.Item>
        )}
        <ContextMenu.Item
          key="rate"
          onSelect={() =>
            navigation.navigate("Rate", {
              userId: otherUser.id,
              beepId: item.id,
            })
          }
        >
          <ContextMenu.ItemTitle>Rate</ContextMenu.ItemTitle>
        </ContextMenu.Item>
        <ContextMenu.Item
          key="report"
          onSelect={() =>
            navigation.navigate("Report", {
              userId: otherUser.id,
              beepId: item.id,
            })
          }
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
  [Status.COMPLETE]: "✅",
};
