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
}

export function Card(props: Props) {
  const { onPress, ...rest } = props;

  if (onPress) {
    return (
      <PressableFeedback
        onPress={props.onPress}
        className="w-full overflow-auto"
      >
        <HeroCard {...props}>
          <PressableFeedback.Highlight />
          {rest.children}
        </HeroCard>
      </PressableFeedback>
    );
  }

  return <HeroCard {...props} />;
}
