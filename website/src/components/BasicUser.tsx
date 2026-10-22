import React, { ComponentProps } from "react";
import { Avatar, Typography } from "@heroui/react";
import { Link } from "./Link";

interface Props {
  user: { first: string, last: string, id: string, photo: string | null };
  linkProps?: Partial<ComponentProps<typeof Link>>;
}

export function BasicUser(props: Props) {
  return (
    <Link to="/admin/users/$userId" params={{ userId: props.user.id } as any} className="flex! items-center gap-3" {...props.linkProps}>
      <Avatar>
        <Avatar.Image
          alt={`${props.user.first} ${props.user.last}`}
          src={props.user.photo ?? undefined}
        />
        <Avatar.Fallback>
          {props.user.first.at(0)?.toUpperCase()}{props.user.last.at(0)?.toUpperCase()}
        </Avatar.Fallback>
      </Avatar>
      <Typography type="body">{props.user.first} {props.user.last}</Typography>
    </Link>
  );
}
