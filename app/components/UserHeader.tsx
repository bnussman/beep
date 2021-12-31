import React from "react";
import { User } from "../generated/graphql";
import { Text, Box, Flex, Avatar, Heading } from "native-base";

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
        source={{ uri: user.photoUrl ? user.photoUrl : undefined }}
      />
      <Box>
        <Heading size="md">{user.name}</Heading>
        <Text>@{user.username}</Text>
      </Box>
    </Flex>
  );
}
