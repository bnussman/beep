import React from "react";
import { Heading, Text } from "native-base";
import { Card } from "../components/Card";

interface Props {
  position: number;
  firstName: string;
}

export function PlaceInQueue({ position, firstName }: Props) {
  return (
    <Card w="100%" alignItems="center" justifyContent="center">
      <Heading>{position}</Heading>
      <Text>
        {position === 1 ? "person is" : "people are"} ahead of you in{" "}
        {firstName}&apos;s queue.
      </Text>
    </Card>
  );
}
