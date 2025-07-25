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
    <Card variant="outlined" style={{ padding: 16, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
      <Text>
        <Text weight="800">Rates </Text>
        <Text>per person</Text>
      </Text>
      <View style={{ display: 'flex', flexDirection: 'row', gap: 16 }}>
        <View>
          <Text weight="bold">Single</Text>
          <Text>${singles}</Text>
        </View>
        <View>
          <Text weight="bold">Group</Text>
          <Text>${group}</Text>
        </View>
      </View>
    </Card>
  );
}
