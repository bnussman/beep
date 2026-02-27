import React from "react";
import { Stack, Avatar, Typography, Link } from "@mui/material";
import { Link as RouterLink } from "@tanstack/react-router";

interface Props {
  user: {
    id: string;
    photo: string | null | undefined;
    first: string;
    last: string;
  } | null;
}

export function BasicUser(props: Props) {
  const { user } = props;

  if (!user) {
    return (
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography>
          None
        </Typography>
        <Avatar sx={{ width: 32, height: 32 }} />
      </Stack>
    );
  }

  return (
    <Link component={RouterLink} to={`/admin/users/${user.id}`}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography>
          {user.first} {user.last}
        </Typography>
        <Avatar src={user.photo ?? undefined} sx={{ width: 32, height: 32 }} />
      </Stack>
    </Link>
  );
}
