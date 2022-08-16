import React from "react";
import { HStack, Text, Box, Spacer } from "native-base";
import { Card } from "../../components/Card";

interface Props {
  singles: number;
  group: number;
}

export function Rates({ singles, group }: Props) {
  return (
    <Card py={2} w="100%" alignItems="center">
      <HStack space={4} alignItems="center" w="100%">
        <Text>
          <Text fontWeight="extrabold">Rates </Text>
          <Text>per person</Text>
        </Text>
        <Spacer />
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
