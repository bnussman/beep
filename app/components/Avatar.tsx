import React from "react";
import { AvatarProps, Avatar as _Avatar } from "tamagui";

interface Props {
  url: string | null | undefined;
}

export function __Avatar(props: Props & AvatarProps) {
  const { url, ...rest } = props;

  return (
    <_Avatar
      size={42}
      circular
      {...rest}
    >
      {url && <_Avatar.Image src={url} />}
      <_Avatar.Fallback />
    </_Avatar>
  );
}

export const Avatar = React.memo(__Avatar);
