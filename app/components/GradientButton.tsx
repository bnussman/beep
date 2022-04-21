import React from "react";
import { Box, Pressable, Spinner } from "native-base";

interface Props {
  onPress: () => void;
  isDisabled?: boolean;
  isLoading?: boolean;
  children: string | JSX.Element;
  size?: "sm" | "lg";
}

export function GradietnButton(props: Props) {
  const { onPress, isDisabled, isLoading, children, size = "lg" } = props;

  return (
    <Pressable onPress={!isDisabled ? onPress : undefined}>
      <Box
        style={{
          shadowRadius: 10,
          shadowColor: "rgb(251, 123, 162)",
        }}
        bg={{
          linearGradient: {
            colors: ["#fb7ba2", "#fce043"],
            start: [0, 0],
            end: [1, 0],
          },
        }}
        opacity={isDisabled ? 0.6 : undefined}
        p={size === "sm" ? 2.5 : 4}
        rounded="lg"
        _text={{
          px: 2,
          fontSize: size,
          fontWeight: size === "sm" ? "bold" : "extrabold",
          color: "white",
          textAlign: "center",
        }}
      >
        {isLoading ? <Spinner size="sm" /> : children}
      </Box>
    </Pressable>
  );
}
