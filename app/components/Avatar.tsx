import React from "react";
import { Avatar as _Avatar, IAvatarProps } from "native-base";
import { ImageSourcePropType } from "react-native";
import AvatarImage from "../assets/avatarDark.png";

interface Props {
  url: string | null | undefined;
  online?: boolean;
}

export function __Avatar(props: Props & IAvatarProps) {
  const { url, online, ...rest } = props;

  const source: ImageSourcePropType = url ? { uri: url } : AvatarImage;

  const key = url ? url : "default";

  return (
    <_Avatar
      _image={{
        defaultSource: AvatarImage,
        fallbackSource: AvatarImage,
      }}
      {...rest}
      key={key}
      source={source}
    >
      {online && <_Avatar.Badge size="4" bg="green.400" />}
    </_Avatar>
  );
}

export const Avatar = React.memo(__Avatar);
