import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { Button, XStack } from "tamagui";

export interface RateBarProps {
  hint: string;
  value: number;
  onValueChange: (value: number) => void;
}

export const RateBar = (props: RateBarProps) => {
  const renderRateButtonElement = (value: number) => {
    const color: string = value <= props.value ? "gold" : "gray";

    return (
      <Button
        icon={<AntDesign name="star" color={color} />}
        key={value}
        onPress={() => props.onValueChange(value)}
      />
    );
  };

  const { ...restProps } = props;

  return (
    <XStack {...restProps}>
      {[1, 2, 3, 4, 5].map(renderRateButtonElement)}
    </XStack>
  );
};
