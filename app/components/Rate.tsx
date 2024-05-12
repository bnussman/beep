import React from "react";
import { View } from "react-native";
import { Button } from "@/components/Button";
import { Text } from "@/components/Text";

export interface RateBarProps {
  hint: string;
  value: number;
  onValueChange: (value: number) => void;
}

export const RateBar = (props: RateBarProps) => {
  return (
    <View className="flex flex-row gap-2">
      {[1, 2, 3, 4, 5].map((value) => {
        const isSelected = value <= props.value;

        return (
          <Button key={value} onPress={() => props.onValueChange(value)}>
            <Text>{isSelected ? "⭐" : "⚪"}</Text>
          </Button>
        );
      })}
    </View>
  );
};
