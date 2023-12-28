import React from "react";
import { XStack, SizableText, Stack } from "tamagui";
import {
  useWebsocketStatus,
  WebsocketStatus as WebsocketStatusType,
} from "../utils/useWebsocketStatus";

export function WebsocketStatus() {
  const status = useWebsocketStatus();

  const colorMap: Record<WebsocketStatusType, string> = {
    Closed: "red",
    Opened: "orange",
    Connecting: "orange",
    Connected: "green",
  };

  return (
    <XStack px={5} py={3} space={7} alignItems="center">
      <Stack bg={colorMap[status]} width="$2" height="$2" borderRadius="$4" />
      <SizableText fontWeight="bold">{status}</SizableText>
    </XStack>
  );
}
