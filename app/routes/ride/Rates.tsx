import React from "react";
import { HStack, Text, Box } from "native-base";
import { Card } from "../../components/Card";

interface Props {
  singles: number;
  group: number;
}

export function Rates({ singles, group }: Props) {
  return (
    <Card>
      <HStack space={4}>
        <Box alignItems="center">
          <Text fontWeight="extrabold">Single</Text>
          <Text>${singles}</Text>
        </Box>
        <Box alignItems="center">
          <Text fontWeight="extrabold">Group</Text>
          <Text>${group}</Text>
        </Box>
      </HStack>
    </Card>
  );
}
