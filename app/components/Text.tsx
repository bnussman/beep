import {
  Text as _Text,
  TextProps as _TextProps,
  TextStyle,
  useColorScheme,
} from "react-native";
import React from "react";

const fontSizeMap = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
  "4xl": 36,
  "5xl": 48,
};

export interface TextProps extends _TextProps {
  /**
   * Set a font size
   * @default md
   */
  size?: keyof typeof fontSizeMap;
  /**
   * Set a font weight
   * @default normal
   */
  weight?: TextStyle["fontWeight"];
  /**
   * Override the text color
   */
  color?: "error" | "subtle";
}

export const Text = React.forwardRef<_Text, TextProps>((props, ref) => {
  const { size, weight, color, ...rest } = props;

  const colorScheme = useColorScheme();

  if (Array.isArray(rest.children) && rest.children.every((c) => !c)) {
    return null;
  }

  if (rest.children === null || rest.children === undefined) {
    return null;
  }

  return (
    <_Text
      ref={ref}
      {...rest}
      style={[
        colorScheme === "dark" ? { color: "white" } : { color: "black" },
        weight ? { fontWeight: weight } : {},
        size ? { fontSize: fontSizeMap[size] } : {},
        rest.style,
      ]}
    />
  );
});
