import React from 'react';
import { Avatar, Stack, TableCell, Typography, Link } from "@mui/material";
import { Link as RouterLink } from '@tanstack/react-router';

interface Props {
  user: { first: string, last: string, id: string, photo: string | null };
}

export function TableCellUser(props: Props) {
  return (
    <TableCell>
      <Link component={RouterLink} to={`/admin/users/${props.user.id}`}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar src={props.user.photo ?? undefined} />
          <Typography>{props.user.first} {props.user.last}</Typography>
        </Stack>
      </Link>
    </TableCell>
  );
}
