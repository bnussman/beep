import React from "react";
import { Card } from "@/components/Card";
import { Text } from "@/components/Text";
import { View } from "react-native";

interface Props {
  riders_before_accepted: number;
  riders_before_unaccepted: number;
  firstName: string;
}

export function PlaceInQueue({
  riders_before_accepted,
  riders_before_unaccepted,
  firstName,
}: Props) {
  const items = [
    {
      value: riders_before_accepted,
      message: `${riders_before_accepted === 1 ? "person is" : "people are"} ahead of you in ${firstName}'s queue.`,
    },
    {
      value: riders_before_unaccepted,
      message: `${riders_before_unaccepted === 1 ? "person" : "people"} ahead of you ${riders_before_unaccepted === 1 ? "is" : "are"} waiting to be accepted or denied.`,
    },
  ];

  return (
    <View style={{ gap: 16 }}>
      {items
        .filter((item) => item.value)
        .map((item) => (
          <Card
            key={item.message}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 16,
              flexDirection: "row",
            }}
          >
            <Text weight="800" size="3xl">
              {item.value}
            </Text>
            <Text>{item.message}</Text>
          </Card>
        ))}
    </View>
  );
}
