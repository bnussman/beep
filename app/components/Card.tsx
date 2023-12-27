import React from "react";
import { Pressable, useColorScheme } from "react-native";
import { Stack, StackProps } from "tamagui";

interface Props extends StackProps {
  pressable?: boolean;
}

export function Card(props: Props) {
  const { pressable, children } = props;

  const colorMode = useColorScheme();

  if (pressable) {
    return (
      <Pressable onPress={props.onPress}>
        <Stack p="$4" backgroundColor={colorMode === "dark" ? "black" : "white"} borderRadius="$4" borderWidth="$1" borderColor="$gray3" pressStyle={{ backgroundColor: "$gray5" }}>
          {children}
        </Stack>
      </Pressable>
    );
  }

  return (
    <Stack p="$4" backgroundColor={colorMode === "dark" ? "black" : "white"} borderRadius="$4" borderWidth="$1" borderColor="$gray3" pressStyle={{ backgroundColor: "$gray5" }}>
      {children}
    </Stack>
  );
}
