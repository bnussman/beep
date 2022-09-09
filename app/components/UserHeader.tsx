import React from "react";
import { User } from "../generated/graphql";
import { Text, Box, Heading, HStack } from "native-base";
import { Avatar } from "./Avatar";
import { ThemeComponentSizeType } from "native-base/lib/typescript/components/types";

interface Props {
  user: User;
  size?: ThemeComponentSizeType<"Avatar">;
}

export function UserHeader({ user, size = 'md' }: Props) {
  return (
    <HStack alignItems="center">
      <Avatar
        mr={2}
        size={size}
        url={user.photo}
      />
      <Box>
        <Heading size="md" letterSpacing="sm" fontWeight="extrabold">{user.name}</Heading>
        <Text>@{user.username}</Text>
      </Box>
    </HStack>
  );
}
