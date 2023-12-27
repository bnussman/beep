import React from "react";
import { AvatarProps, Stack, Avatar as _Avatar } from "tamagui";
import { ImageSourcePropType } from "react-native";
import AvatarImage from "../assets/avatarDark.png";
import { IAvatarBadgeProps } from "native-base/lib/typescript/components/composites/Avatar";

interface Props {
  url: string | null | undefined;
  online?: boolean;
  badgeSize?: IAvatarBadgeProps["size"];
}

export function __Avatar(props: Props & AvatarProps) {
  const { url, online, badgeSize, ...rest } = props;

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
      {online && <Stack size={badgeSize ?? "4"} bg="green.400" />}
    </_Avatar>
  );
}

export const Avatar = React.memo(__Avatar);
