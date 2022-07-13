import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { HStack, Icon, Text } from "native-base";
import {
  useWebsocketStatus,
  WebsocketStatus as WebsocketStatusType,
} from "../utils/useWebsocketStatus";

export function WebsocketStatus() {
  const status = useWebsocketStatus();

  const colorMap: Record<WebsocketStatusType, string> = {
    Closed: "red.400",
    Opened: "orange.300",
    Connecting: "orange.300",
    Connected: "green.400",
  };

  return (
    <HStack px={5} py={3} space={7} alignItems="center">
      <Icon
        color={colorMap[status]}
        size={6}
        name="checkbox-blank-circle"
        as={MaterialCommunityIcons}
      />
      <Text mr={4} fontWeight={500}>
        {status}
      </Text>
    </HStack>
  );
}
