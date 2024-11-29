import React from "react";
import { Image } from "react-native";
import type { ImageProps } from "react-native";
import AvatarImage from "../assets/avatar.png";
import { VariantProps, cva } from "class-variance-authority";

export const avatar = cva(["rounded-full"], {
  variants: {
    size: {
      xs: "!size-12",
      sm: "!size-14",
      md: "!size-16",
      lg: "!size-20",
      xl: "!size-32",
      "2xl": "!size-48",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

interface Props extends ImageProps, VariantProps<typeof avatar> {}

export function Avatar(props: Props) {
  const { className, src, size, ...rest } = props;
  return (
    <Image
      source={src ? { uri: src } : AvatarImage}
      defaultSource={AvatarImage}
      className={avatar({ className, size })}
      {...rest}
    />
  );
}
