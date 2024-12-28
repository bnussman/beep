import React from "react";
import { Image } from "react-native";
import type { ImageProps } from "react-native";
import AvatarImage from "../assets/avatar.png";

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const SIZE_MAP: Record<Size, number> = {
  xs: 48,
  sm: 56,
  md: 64,
  lg: 80,
  xl: 128,
  '2xl': 192,
};

interface Props extends ImageProps {
  size: Size;
}

export function Avatar(props: Props) {
  const { className, src, size = 'md', ...rest } = props;

  return (
    <Image
      source={src ? { uri: src } : AvatarImage}
      defaultSource={AvatarImage}
      style={{
        borderRadius: '50%',
        width: SIZE_MAP[size],
        height: SIZE_MAP[size]
      }}
      {...rest}
    />
  );
}
