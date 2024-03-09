import React from "react";
import { XStack, Text, Circle, CircleProps } from "@beep/ui";
import {
  useWebsocketStatus,
  WebsocketStatus as WebsocketStatusType,
} from "../utils/useWebsocketStatus";

export function WebsocketStatus() {
  const status = useWebsocketStatus();

  const colorMap: Record<WebsocketStatusType, CircleProps["backgroundColor"]> = {
    Closed: "$red8",
    Opened: "$orange8",
    Connecting: "$orange8",
    Connected: "$green8",
  };

  return (
    <XStack gap="$2" alignItems="center">
      <Circle backgroundColor={colorMap[status]} size="$4" />
      <Text>
        {status}
      </Text>
    </XStack>
  );
}
