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
    <Card variant="outlined" className="p-4 flex flex-row justify-between w-full items-center">
      <Text>
        <Text weight="800">Rates </Text>
        <Text>per person</Text>
      </Text>
      <View className="flex flex-row gap-4">
        <View className="items-center">
          <Text weight="bold">Single</Text>
          <Text>${singles}</Text>
        </View>
        <View className="items-center">
          <Text weight="bold">Group</Text>
          <Text>${group}</Text>
        </View>
      </View>
    </Card>
  );
}
