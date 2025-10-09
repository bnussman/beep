import React from "react";
import { View } from "react-native";
import { Text } from "@/components/Text";

interface Props {
  singles: number;
  group: number;
}

export function Rates({ singles, group }: Props) {
  return (
    <View style={{ gap: 4 }}>
      <Text>
        <Text weight="800">Rates</Text> <Text color="subtle">(per person)</Text>
      </Text>
      <Text>
        <Text>${singles} for singles</Text> / <Text>${group} for groups</Text>
      </Text>
    </View>
  );
}
