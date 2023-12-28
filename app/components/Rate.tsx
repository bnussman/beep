import { Star } from "@tamagui/lucide-icons";
import React from "react";
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
        icon={<Star color={color} />}
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
