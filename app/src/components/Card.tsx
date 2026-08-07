import {
  PressableFeedback,
  Card as HeroCard,
  CardRootProps,
} from "heroui-native";
import React from "react";

interface Props extends CardRootProps {
  /**
   * Makes the card pressable
   */
  onPress?: () => void;
  /**
   * Makes the card pressable
   */
  onLongPress?: () => void;
}

export function Card(props: Props) {
  const { onPress, onLongPress, ...rest } = props;

  if (onPress) {
    return (
        <HeroCard {...rest}>
          {rest.children}
        </HeroCard>
    );
  }

  return <HeroCard {...props} />;
}
