import React from "react";
import { Image } from "react-native";
import type { ImageProps } from "react-native";
// @ts-expect-error image
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
  size?: Size;
}

export function Avatar(props: Props) {
  const { src, size = 'md', ...rest } = props;

  const px = SIZE_MAP[size];

  return (
    <Image
      source={src ? { uri: src } : AvatarImage}
      defaultSource={AvatarImage}
      {...rest}
      style={[
        {
          borderRadius: px / 2,
          width: px,
          height: px,
          backgroundColor: 'gray',
        },
        rest.style
      ]}
    />
  );
}
