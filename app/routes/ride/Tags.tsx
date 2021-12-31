import { User } from "../../generated/graphql";
import React from "react";
import { Badge } from "native-base";

interface TagProps {
  status: string;
  children: any;
}

interface Props {
  user: Partial<User>;
}

export function Tag(props: TagProps): JSX.Element {
  const { status, children } = props;

  return <Badge>{children}</Badge>;
}

export function Tags(props: Props): JSX.Element {
  const { user } = props;

  return (
    <>
      {user.isStudent && <Tag status="basic">Student</Tag>}
      {user.masksRequired && <Tag status="info">Masks Required</Tag>}
      {user.role == "ADMIN" && <Tag status="danger">Founder</Tag>}
    </>
  );
}
