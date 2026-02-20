import React from 'react';
import { Avatar, Stack, TableCell, Typography } from "@mui/material";
import { Link, LinkProps } from '@tanstack/react-router';

interface Props {
  user: { first: string, last: string, id: string, photo: string | null };
  linkProps?: Partial<LinkProps>;
}

export function TableCellUser(props: Props) {
  return (
    <TableCell>
      <Link to="/admin/users/$userId" params={{ userId: props.user.id }} {...props.linkProps}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar src={props.user.photo ?? undefined} />
          <Typography>{props.user.first} {props.user.last}</Typography>
        </Stack>
      </Link>
    </TableCell>
  );
}
