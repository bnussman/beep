import React from 'react';
import { Avatar, Box, Stack, TableCell, Typography } from "@mui/material";
import { Link } from '@tanstack/react-router';

interface Props {
  user: { first: string, last: string, id: string, photo: string | null };
}

export function TableCellUser(props: Props) {
  return (
    <TableCell>
      <Link to="/admin/users/$userId" params={{ userId: props.user.id }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar src={props.user.photo ?? undefined} />
          <Typography>{props.user.first} {props.user.last}</Typography>
        </Stack>
      </Link>
    </TableCell>
  );
}
