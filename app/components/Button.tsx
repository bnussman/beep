import {
  Pressable,
  PressableProps,
  ActivityIndicator,
  ActivityIndicatorProps,
  PressableStateCallbackType,
  ViewStyle,
} from "react-native";
import { Text } from "./Text";
import { useTheme } from "@/utils/theme";

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
  /**
   * The color of the button
   * If no color is provided, the button will be a netral color
   */
  color?: "red" | "green";
}

export function Button(props: Props) {
  const {
    children,
    isLoading,
    variant = "primary",
    size = "md",
    color,
    activityIndicatorProps,
    ...rest
  } = props;

  const theme = useTheme();

  const getStyle = (state: PressableStateCallbackType): ViewStyle[] => {
    const style = [
      {
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        cursor: props.disabled ? "auto" : "pointer",
        padding: sizeMap[size],
      },
    ] as ViewStyle[];

    if (variant === "primary") {
      style.push({
        backgroundColor: theme.components.button.primary.backgroundColor,
      });

      if (state.pressed) {
        style.push({
          backgroundColor:
            theme.components.button.primary.pressed.backgroundColor,
        });
      }
    }

    if (variant === "secondary") {
      style.push({});

      if (state.pressed) {
        style.push({
          backgroundColor:
            theme.components.button.secondary.pressed.backgroundColor,
        });
      }
    }

    if (color === "red" || color === "green") {
      style.push({
        backgroundColor: theme.components.button[color].backgroundColor,
        borderColor: theme.components.button[color].borderColor,
        borderWidth: 1,
      });

      if (state.pressed) {
        style.push({
          backgroundColor:
            theme.components.button[color].pressed.backgroundColor,
        });
      }
    }

    return style;
  };
  return (
    <Pressable
      accessibilityRole="button"
      {...rest}
      style={(state) => [
        ...getStyle(state),
        typeof rest.style === "function" ? rest.style(state) : rest.style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator {...activityIndicatorProps} />
      ) : typeof children === "string" ? (
        <Text weight="800" style={color ? {} : {}}>
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
