import React from "react";
import { Avatar as _Avatar } from "tamagui";

interface Props {
  url: string | null | undefined;
}

export function __Avatar(props: Props) {
  const { url } = props;

  return (
    <_Avatar
      size={42}
      circular
    >
      {url && <_Avatar.Image src={url} />}
      <_Avatar.Fallback />
    </_Avatar>
  );
}

export const Avatar = React.memo(__Avatar);
