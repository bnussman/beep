import React from "react";
import { Pressable, Box, IBoxProps, IPressableProps } from "native-base";

type Props =
  | ({ pressable?: true } & IPressableProps)
  | ({ pressable?: false } & IBoxProps);

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
      <Pressable
        _pressed={{ _light: { bg: "gray.100" }, _dark: { bg: "gray.800" } }}
        {...common}
        {...(rest as IPressableProps)}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <Box {...common} {...(rest as IBoxProps)}>
      {children}
    </Box>
  );
}
