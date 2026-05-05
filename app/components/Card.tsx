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
      <PressableFeedback
        onPress={onPress}
        onLongPress={onLongPress}
        className="w-full overflow-auto"
      >
        <HeroCard {...rest}>
          <PressableFeedback.Highlight />
          {rest.children}
        </HeroCard>
      </PressableFeedback>
    );
  }

  return <HeroCard {...props} />;
}
