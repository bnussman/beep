import React from "react";
import { Box, Pressable, Spinner } from "native-base";

interface Props {
  onPress: () => void;
  isDisabled?: boolean;
  isLoading?: boolean;
  children: string | JSX.Element;
  size?: "sm" | "lg";
  h?: '100%' | number;
  w?: '100%' | number;
}

export function GradietnButton(props: Props) {
  const { onPress, isDisabled, isLoading, children, size = "lg", ...rest } = props;

  return (
    <Pressable
      onPress={!isDisabled ? onPress : undefined}
      _pressed={!isDisabled ? { opacity: 0.7 } : undefined}
      _hover={!isDisabled ? { opacity: 0.7 } : undefined}
      style={{
        shadowOpacity: 1,
        elevation: 3,
        shadowRadius: 10,
        shadowColor: "#fb7ba2",
      }}
      {...rest}
    >
      <Box
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
        {...rest}
      >
        {isLoading ? <Spinner size="sm" /> : children}
      </Box>
    </Pressable>
  );
}
