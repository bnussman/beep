import {
  Pressable,
  PressableProps,
  ActivityIndicator,
  ActivityIndicatorProps,
  StyleSheet,
} from "react-native";
import { Text } from "./Text";
import { Theme, useTheme } from "@/utils/theme";

const sizeMap = {
  sm: 8,
  md: 16,
  lg: 24,
};

interface Props extends PressableProps {
  /**
   * Shows a loading indicator instead of children
   */
  isLoading?: boolean;
  /**
   * Optional props to pass to the ActivityIndicator when `isLoading` is true
   */
  activityIndicatorProps?: ActivityIndicatorProps;
  /**
   * @default primary
   */
  variant?: "primary" | "secondary";
  /**
   * @default md
   */
  size?: "sm" | "md" | "lg";
}

export function Button(props: Props) {
  const {
    children,
    isLoading,
    variant = "primary",
    size = "md",
    activityIndicatorProps,
    ...rest
  } = props;

  const theme = useTheme();
  const style = createStyle(theme, variant, rest.disabled);

  return (
    <Pressable
      accessibilityRole="button"
      {...rest}
      style={(state) => [
        style.button,
        style[variant],
        { padding: sizeMap[size] },
        state.pressed &&
          variant === "primary" && {
            backgroundColor:
              theme.components.button.primary.pressed.backgroundColor,
          },
        state.pressed &&
          variant === "secondary" && {
            backgroundColor:
              theme.components.button.secondary.pressed.backgroundColor,
          },
        typeof rest.style === "function" ? rest.style(state) : rest.style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator {...activityIndicatorProps} />
      ) : typeof children === "string" ? (
        <Text weight="800">{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

const createStyle = (
  theme: Theme,
  variant: Props["variant"] = "primary",
  disabled: boolean | null | undefined,
) =>
  StyleSheet.create({
    button: {
      borderRadius: 12,
      // display: 'flex',
      alignItems: "center",
      justifyContent: "center",
      cursor: disabled ? "auto" : "pointer",
      overflow: "hidden",
      overlayColor: "transparent",
    },
    primary: {
      backgroundColor: theme.components.button.primary.backgroundColor,
    },
    secondary: {},
  });
