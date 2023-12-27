import React from "react";
import { Pressable } from "react-native";
import { Stack, StackProps } from "tamagui";

interface Props extends StackProps {
  pressable?: boolean;
}

export function Card(props: Props) {
  const { pressable, children, ...rest } = props;

  const common = {
    p: 4,
    rounded: "xl",
    borderWidth: 2,
    _light: { bg: "white", borderColor: "gray.100" },
    _dark: { bg: "gray.900", borderColor: "gray.800" },
  };

  if (pressable) {
    return (
      <Pressable onPress={props.onPress}>
        {children}
      </Pressable>
    );
  }

  return (
    <Stack>
      {children}
    </Stack>
  );
}
