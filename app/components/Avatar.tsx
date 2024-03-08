import React from "react";
import { Avatar as _Avatar, AvatarProps } from "@beep/ui";
import AvatarImage from "../assets/avatarDark.png";

interface Props extends AvatarProps {
  url: string | null | undefined;
}

export function Avatar(props: Props) {
  const { url, ...rest } = props;

  return (
    <_Avatar circular size="$6" {...rest}>
      <_Avatar.Image src={url ?? AvatarImage} defaultSource={AvatarImage} />
      <_Avatar.Fallback bc="red" />
    </_Avatar>
  );
}
