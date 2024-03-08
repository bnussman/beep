import React from "react";
import { Text, Heading, XStack, Stack } from "@beep/ui";
import { Avatar } from "./Avatar";

interface Props {
  name: string;
  picture: string | null | undefined;
  username: string;
}

export function UserHeader({ picture, name, username }: Props) {
  return (
    <XStack alignItems="center" gap="$4">
      <Avatar size="$6" url={picture} />
      <Stack>
        <Heading fontWeight="bold">
          {name}
        </Heading>
        <Text color="$gray8">
          @{username}
        </Text>
      </Stack>
    </XStack>
  );
}
