import React from "react";
import { Card } from "@/components/Card";
import { Text } from "@/components/Text";

interface Props {
  position: number;
  firstName: string;
}

export function PlaceInQueue({ position, firstName }: Props) {
  return (
    <Card style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8 }} variant="outlined">
      <Text weight="800" size="3xl">
        {position}
      </Text>
      <Text>
        {position === 1 ? "person is" : "people are"} ahead of you in{" "}
        {firstName}&apos;s queue.
      </Text>
    </Card>
  );
}
