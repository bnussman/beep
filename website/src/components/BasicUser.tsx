import React from "react";
import { Avatar, Typography } from "@heroui/react";
import { Link } from "./Link";

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
      <div className="flex items-center gap-3">
        <Typography type="body" className="whitespace-nowrap">
          {user.first} {user.last}
        </Typography>
        <Avatar size="sm">
          <Avatar.Image alt={`${user.first} ${user.last}`} src={user.photo ?? undefined} />
          <Avatar.Fallback>{user.first.at(0)?.toUpperCase()}{user.last.at(0)?.toUpperCase()}</Avatar.Fallback>
        </Avatar>
      </div>
    </Link>
  );
}
