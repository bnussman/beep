import React from "react";
import { Stack, XStack, SizableText } from "tamagui";
import { Card } from "../../components/Card";

interface Props {
  singles: number;
  group: number;
}

export function Rates({ singles, group }: Props) {
  return (
    <Card py="$2" w="100%" alignItems="center">
      <XStack space="$2" alignItems="center" w="100%">
        <SizableText>
          <SizableText fontWeight="bold">Rates </SizableText>
          <SizableText>per person</SizableText>
        </SizableText>
        <Stack flexGrow={1} />
        <Stack alignItems="center">
          <SizableText fontWeight="bold">Single</SizableText>
          <SizableText>${singles}</SizableText>
        </Stack>
        <Stack alignItems="center">
          <SizableText fontWeight="bold">Group</SizableText>
          <SizableText>${group}</SizableText>
        </Stack>
      </XStack>
    </Card>
  );
}
