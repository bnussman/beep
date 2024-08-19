import React from 'react';
import { Avatar, Box, Flex, Td, Text } from "@chakra-ui/react";
import { Link } from '@tanstack/react-router';

interface Props {
  user: { first: string, last: string, id: string, photo: string | null };
}

export function TdUser(props: Props) {
  return (
    <Td>
      <Box as={Link} to={`/admin/users/${props.user.id}`}>
        <Flex align="center">
          <Avatar mr={2} src={props.user.photo || undefined} />
          <Text>{props.user.first} {props.user.last}</Text>
        </Flex>
      </Box>
    </Td>
  );
}
