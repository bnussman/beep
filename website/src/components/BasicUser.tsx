import React from "react";
import { Text, Avatar, Flex } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";

interface Props {
  user: { id: string, photo: string | null | undefined, first: string, last: string };
}

export function BasicUser(props: Props) {
  const { user } = props;

  return (
    <Link to="/admin/users/$userId" params={{ userId: user.id }}>
      <Flex align="center">
        <Avatar src={user.photo ?? undefined} mr={2} />
        <Text>{user.first} {user.last}</Text>
      </Flex>
    </Link>
  );
}
