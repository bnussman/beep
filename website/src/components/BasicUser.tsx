import React from "react";
import { Typography } from "@heroui/react";
import { Avatar, Link } from "@mui/material";
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
      <div className="flex items-center gap-3">
        <Typography>
          {user.first} {user.last}
        </Typography>
        <Avatar src={user.photo ?? undefined} sx={{ width: 32, height: 32 }} />
      </div>
    </Link>
  );
}
