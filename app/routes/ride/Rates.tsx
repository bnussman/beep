import React from "react";
import { View } from "react-native";
import { Text } from "@/components/Text";

interface Props {
  singles: number;
  group: number;
}

export function Rates({ singles, group }: Props) {
  return (
    <View>
      <Text>
        <Text weight="800">Rates </Text>
        <Text color="subtle">(per person)</Text>
      </Text>
      <Text>
        <Text>${singles} </Text>
        <Text>singles / </Text>
        <Text>${group} </Text>
        <Text>groups</Text>
      </Text>
    </View>
  );
}
