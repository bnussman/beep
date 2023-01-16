import React from "react";
import { Text, Box, Heading, HStack } from "native-base";
import { Avatar } from "./Avatar";

interface Props {
  name: string;
  picture: string;
  username: string;
}

export function UserHeader({ picture, name, username }: Props) {
  return (
    <HStack alignItems="center">
      <Avatar mr={2} size="md" url={picture} />
      <Box>
        <Heading size="md" letterSpacing="xs" fontWeight="extrabold">
          {name}
        </Heading>
        <Text color="gray.500" letterSpacing="sm">
          @{username}
        </Text>
      </Box>
    </HStack>
  );
}
