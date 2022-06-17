import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Box, HStack, Icon, Text } from "native-base";

export function EmailNotVerfiedCard() {
  return (
    <Box
      mt={2}
      p={4}
      rounded="xl"
      _light={{ bg: "coolGray.100" }}
      _dark={{ bg: "gray.900" }}
    >
      <HStack alignItems="center">
        <Icon
          color="red.500"
          size={10}
          mr={4}
          as={MaterialCommunityIcons}
          name="alert-circle-outline"
        />
        <Text fontSize="md" fontWeight="extrabold">
          Your email is not verified
        </Text>
      </HStack>
    </Box>
  );
}
