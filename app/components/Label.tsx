import { isWeb } from "@/utils/constants";
import { Text, TextProps } from "./Text";
import { AccessibilityRole, Text as _Text } from "react-native";
import { useEffect } from "react";

interface Props extends TextProps {
  htmlFor?: string;
}

export function Label(props: Props) {
  const { htmlFor, ...rest } = props;

  const id = `${htmlFor}-label`;

  if (isWeb) {
    useEffect(() => {
      if (htmlFor) {
        const label = document.getElementById(id);

        label?.setAttribute("for", htmlFor);
      }
    }, [htmlFor]);
  }

  const webProps = isWeb ? { accessibilityRole: "label" as AccessibilityRole } : {};

  return (
    <Text
      id={id}
      weight="bold"
      {...rest}
      {...webProps}
    />
  );
}
