import React from "react";
import { Card, XStack, Text, Stack } from "@beep/ui";

interface Props {
  singles: number;
  group: number;
}

export function Rates({ singles, group }: Props) {
  return (
    <Card p="$3" w="100%" alignItems="center">
      <XStack gap="$4" alignItems="center" w="100%" jc="space-between">
        <Text>
          <Text fontWeight="bold">Rates </Text>
          <Text>per person</Text>
        </Text>
        <XStack>
          <Stack alignItems="center">
            <Text fontWeight="bold">Single</Text>
            <Text>${singles}</Text>
          </Stack>
          <Stack alignItems="center">
            <Text fontWeight="bold">Group</Text>
            <Text>${group}</Text>
          </Stack>
        </XStack>
      </XStack>
    </Card>
  );
}
