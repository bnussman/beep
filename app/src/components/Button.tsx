import {
  Button as HeroButton,
  ButtonRootProps,
  useThemeColor,
} from "heroui-native";
import { ActivityIndicator } from "react-native";
import React from "react";
import { isIOS, isWeb } from "@/utils/constants";

interface Props {
  /**
   * Shows a loading indicator instead of children
   */
  isLoading?: boolean;
}

export function Button(props: Props & ButtonRootProps) {
  const { children, isLoading, ...rest } = props;

  const themeColorAccentForeground = useThemeColor("accent-foreground");

  return (
    <HeroButton {...rest} variant={rest.variant === 'ghost' && isWeb ? 'secondary' : rest.variant}>
      {isLoading ? (
        <ActivityIndicator color={themeColorAccentForeground} />
      ) : (
        children
      )}
    </HeroButton>
  );
}
