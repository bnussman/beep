import React from "react";
import { Text } from "@/components/Text";

interface Props {
  position: number;
  firstName: string;
}

export function PlaceInQueue({ position, firstName }: Props) {
  return (
    <Text>
      {position} {position === 1 ? "person is" : "people are"} ahead of you in{" "}
      {firstName}&apos;s queue
    </Text>
  );
}
