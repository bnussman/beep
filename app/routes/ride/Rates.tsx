import React from "react";
import { View } from "react-native";
import { Card } from "@/components/Card";
import { Text } from "@/components/Text";

interface Props {
  singles: number;
  group: number;
}

export function Rates({ singles, group }: Props) {
  return (
    <Card className="p-4 flex flex-row justify-between">
      <Text>
        <Text weight="black">Rates </Text>
        <Text>per person</Text>
      </Text>
      <View>
        <View className="items-center">
          <Text weight="bold">Single</Text>
          <Text>${singles}</Text>
        </View>
        <View className="items-center">
          <Text weight="bold">black</Text>
          <Text>${group}</Text>
        </View>
      </View>
    </Card>
  );
}
