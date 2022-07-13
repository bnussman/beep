import React from "react";
import { User } from "../generated/graphql";
import { Text, Box, Flex, Heading } from "native-base";
import { Avatar } from "./Avatar";

interface Props {
  user: User;
}

export function UserHeader(props: Props): JSX.Element {
  const { user } = props;

  return (
    <Flex direction="row" alignItems="center">
      <Avatar
        mr={2}
        size={65}
        url={user.photoUrl}
      />
      <Box>
        <Heading size="md">{user.name}</Heading>
        <Text>@{user.username}</Text>
      </Box>
    </Flex>
  );
}
