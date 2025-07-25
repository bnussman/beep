import { Theme, useTheme } from "@/utils/theme";
import React from "react";
import { Pressable, PressableProps, StyleSheet } from "react-native";

interface Props extends PressableProps {
  /**
   * Applies styles to make card look pressable
   *
   * @default false
   */
  pressable?: boolean;
  /**
   * Variant for the card
   * 
   * @default 'filled'
   */
  variant?: 'outlined' | 'filled';
}

export function Card(props: Props) {
  const { pressable, variant = 'filled', ...rest } = props;

  const theme  = useTheme();
  const styles = createStyle(theme);

  return (
    <Pressable
      {...rest}
      style={(options) => (
        [
          styles.card,
          variant === 'outlined' && {
            backgroundColor: 'transparent',
          },
          typeof rest.style === 'function' ? rest.style(options) : rest.style
        ]
      )}
    />
  );
}

const createStyle = (theme: Theme) => StyleSheet.create({
  card: {
    borderRadius: 12,
    backgroundColor: theme.components.card.bg,
    borderColor: theme.components.card.borderColor,
    borderWidth: 1,
    padding: 16,
  },
});