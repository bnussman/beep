import React from "react";
import { SizableText, H3, XStack, Stack } from "tamagui";
import { Avatar } from "./Avatar";

interface Props {
  name: string;
  picture: string | null | undefined;
  username: string;
}

export function UserHeader({ picture, name, username }: Props) {
  return (
    <XStack alignItems="center">
      <Avatar mr={2} size="md" url={picture} />
      <Stack>
        <H3 fontWeight="bold">{name}</H3>
        <SizableText>@{username}</SizableText>
      </Stack>
    </XStack>
  );
}
