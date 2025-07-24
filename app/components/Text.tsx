import { Text as _Text, TextProps as _TextProps, StyleSheet, TextStyle } from "react-native";
import React from "react";
import { Theme, useTheme } from "@/utils/theme";

const fontSizeMap = {
  'xs': 12,
  'sm': 14,
  'md': 16,
  'lg': 18,
  'xl': 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
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
  weight?: TextStyle['fontWeight'];
  /**
   * Override the text color
   */
  color?: 'error' | 'subtle';
}

export const Text = React.forwardRef<_Text, TextProps>((props, ref) => {
  const { size, className, weight, color, ...rest } = props;
  const theme = useTheme();
  const styles = createStyles(theme);

  if (Array.isArray(rest.children) && rest.children.every((c) => !c)) {
    return null;
  }

  if (rest.children === null || rest.children === undefined) {
    return null;
  }
  
  const colorMap = {
    error: theme.text.error,
    subtle: theme.text.subtle,
  };

  return (
    <_Text
      ref={ref}
      {...rest}
      style={[
        styles.default,
        color ? { color: colorMap[color] } : {},
        weight ? { fontWeight: weight } : {},
        size ? { fontSize: fontSizeMap[size] } : {},
        rest.style
      ]}
    />
  );
});

const createStyles = (theme: Theme) => StyleSheet.create({
  default: {
    color: theme.text.primary, 
  },
});
