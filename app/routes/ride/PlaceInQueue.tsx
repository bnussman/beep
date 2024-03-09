import React from "react";
import { Card, Heading, Text } from "@beep/ui";

interface Props {
  position: number;
  firstName: string;
}

export function PlaceInQueue({ position, firstName }: Props) {
  return (
    <Card w="100%" alignItems="center" justifyContent="center" p="$3">
      <Heading>{position}</Heading>
      <Text>
        {position === 1 ? "person is" : "people are"} ahead of you in{" "}
        {firstName}&apos;s queue.
      </Text>
    </Card>
  );
}
