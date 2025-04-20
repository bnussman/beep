import React from "react";
import { Stack, Avatar, Typography, Link } from "@mui/material";
import { Link as RouterLink } from "@tanstack/react-router";

interface Props {
  user: {
    id: string;
    photo: string | null | undefined;
    first: string;
    last: string;
  };
}

export function BasicUser(props: Props) {
  const { user } = props;

  return (
    <Link component={RouterLink} to={`/admin/users/${user.id}`}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Avatar src={user.photo ?? undefined} sx={{ width: 42, height: 42 }} />
        <Typography>
          {user.first} {user.last}
        </Typography>
      </Stack>
    </Link>
  );
}
