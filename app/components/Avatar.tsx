import React, { useState } from "react";
import { Avatar as _Avatar, AvatarProps } from "@beep/ui";
import AvatarImage from "../assets/avatarDark.png";

interface Props extends AvatarProps {
  url: string | null | undefined;
}

export function Avatar(props: Props) {
  const { url, ...rest } = props;
  const [hasError, setHasError] = useState(false);

  const source = hasError ? AvatarImage : url ? url : AvatarImage;

  return (
    <_Avatar circular size="$6" {...rest}>
      <_Avatar.Image src={source} onError={() => setHasError(true)} />
      <_Avatar.Fallback bc="red" />
    </_Avatar>
  );
}
