import {
  Button as HeroButton,
  ButtonRootProps,
  useThemeColor,
} from "heroui-native";
import { ActivityIndicator } from "react-native";
import React from "react";

interface Props {
  /**
   * Shows a loading indicator instead of children
   */
  isLoading?: boolean;
}

export function Button(props: Props & ButtonRootProps) {
  const {
    children,
    isLoading,
    variant = "primary",
    size = "md",
    ...rest
  } = props;

  const themeColorAccentForeground = useThemeColor("accent-foreground");

  return (
    <HeroButton variant="primary" {...rest}>
      {isLoading ? (
        <ActivityIndicator color={themeColorAccentForeground} />
      ) : (
        children
      )}
    </HeroButton>
  );
}
