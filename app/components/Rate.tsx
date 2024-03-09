import React from "react";
import { XStack, XStackProps } from "@beep/ui";
import { Button } from "@beep/ui";
import { Star, StarFull } from "@tamagui/lucide-icons";

export interface RateBarProps extends XStackProps {
  hint: string;
  value: number;
  onValueChange: (value: number) => void;
}

export const RateBar = (props: RateBarProps) => {
  const renderRateButtonElement = (value: number) => {
    const isSelected = value <= props.value

    const color = isSelected ? "gold" : "$gray8";
    const Icon = isSelected ? <StarFull size="$2" /> : <Star size="$2" />;

    return (
      <Button
        backgroundColor="$colorTransparent"
        px="$2"
        icon={Icon}
        color={color}
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
