import React from 'react';
import { Avatar, Box, Flex, Td, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { User } from "../generated/graphql";

interface Props {
  user: Partial<User>;
}

export function TdUser(props: Props) {
  return (
    <Td>
      <Box as={Link} to={`/admin/users/${props.user.id}`}>
        <Flex align="center">
          <Avatar mr={2} src={props.user.picture || undefined} />
          <Text>{props.user.name}</Text>
        </Flex>
      </Box>
    </Td>
  );
}