import React from "react";
import { Text } from "@/components/Text";
import { useWebsocketStatus } from "../utils/useWebsocketStatus";

export function WebsocketStatus() {
  const status = useWebsocketStatus();

  return <Text>{status}</Text>;
}
