import React from "react";
import { Alert } from "@heroui/react";

export function NotFound() {
  return (
    <Alert status="accent">
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>Not found!</Alert.Title>
      </Alert.Content>
    </Alert>
  );
}
