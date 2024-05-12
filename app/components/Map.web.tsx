import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import React from "react";
import { MapViewProps } from "react-native-maps";

export function Map(props: MapViewProps) {
  return (
    <Card
      className="p-4 items-center justify-center min-h-32"
      style={props.style}
    >
      <Text>Map not supported in web</Text>
    </Card>
  );
}
