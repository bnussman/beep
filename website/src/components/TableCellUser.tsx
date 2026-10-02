import React, { ComponentProps } from 'react';
import { Avatar, Table } from "@heroui/react";
import { Link } from './Link';

interface Props {
  user: { first: string, last: string, id: string, photo: string | null };
  linkProps?: Partial<ComponentProps<typeof Link>>;
}

export function TableCellUser(props: Props) {
  return (
    <Table.Cell>
      <Link to="/admin/users/$userId" params={{ userId: props.user.id } as any} {...props.linkProps}>
        <div className="flex items-center gap-3">
          <Avatar>
            <Avatar.Image
              alt={`${props.user.first} ${props.user.last}`}
              src={props.user.photo ?? undefined}
            />
            <Avatar.Fallback>
              {props.user.first.at(0)?.toUpperCase()}{props.user.last.at(0)?.toUpperCase()}
            </Avatar.Fallback>
          </Avatar>
          <span>{props.user.first} {props.user.last}</span>
        </div>
      </Link>
    </Table.Cell>
  );
}
