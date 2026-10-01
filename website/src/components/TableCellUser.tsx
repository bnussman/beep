import React, { ComponentProps } from 'react';
import { Avatar, Stack, TableCell, Typography } from "@mui/material";
import { Link } from './Link';

interface Props {
  user: { first: string, last: string, id: string, photo: string | null };
  linkProps?: Partial<ComponentProps<typeof Link>>;
}

export function TableCellUser(props: Props) {
  return (
    <TableCell>
      <Link to="/admin/users/$userId" params={{ userId: props.user.id } as any} {...props.linkProps}>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Avatar src={props.user.photo ?? undefined} />
          <Typography>{props.user.first} {props.user.last}</Typography>
        </Stack>
      </Link>
    </TableCell>
  );
}
