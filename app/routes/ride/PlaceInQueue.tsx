import React from "react";
import { Card } from "@/components/Card";
import { Text } from "@/components/Text";
import { View } from "react-native";

interface Props {
  riders_before_accepted: number;
  riders_before_unaccepted: number;
  total_riders_waiting: number;
  firstName: string;
}

export function PlaceInQueue({
  riders_before_accepted,
  riders_before_unaccepted,
  total_riders_waiting,
  firstName,
}: Props) {
  const otherRidersWaiting = total_riders_waiting - 1;

  const items = [
    {
      show: riders_before_accepted > 0,
      message: `${riders_before_accepted} ${riders_before_accepted === 1 ? "person is" : "people are"} ahead of you in ${firstName}'s queue.`,
    },
    {
      show: riders_before_unaccepted > 0,
      message: `${riders_before_unaccepted} ${riders_before_unaccepted === 1 ? "person" : "people"} ahead of you ${riders_before_unaccepted === 1 ? "is" : "are"} waiting to be accepted or denied.`,
    },
    {
      show:
        otherRidersWaiting > 0 &&
        otherRidersWaiting !== riders_before_unaccepted,
      message: `${otherRidersWaiting} other ${otherRidersWaiting === 1 ? "person is" : "people are"} also waiting to be accepted or denied.`,
    },
  ];

  return (
    <View>
      {items
        .filter((item) => item.show)
        .map((item) => (
          <Text key={item.message}>
            <Text style={{ flexShrink: 1 }}>{item.message}</Text>
          </Text>
        ))}
    </View>
  );
}
