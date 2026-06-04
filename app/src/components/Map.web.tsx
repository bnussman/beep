import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import React from "react";
import { MapViewProps } from "react-native-maps";

export function Map(props: MapViewProps) {
  return (
    <Card
      style={[
        { padding: 16, alignItems: 'center', justifyContent: 'center'},
        props.style
      ]}
    >
      <Text>Map not supported in web</Text>
    </Card>
  );
}
