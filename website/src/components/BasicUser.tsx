import React from "react";
import { Stack, Avatar, Typography } from "@mui/material";
import { Link } from "@tanstack/react-router";

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
    <Link to="/admin/users/$userId" params={{ userId: user.id }}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Avatar src={user.photo ?? undefined} sx={{ width: 64, height: 64 }} />
        <Typography>
          {user.first} {user.last}
        </Typography>
      </Stack>
    </Link>
  );
}
