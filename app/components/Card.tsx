import { VariantProps, cva, cx } from "class-variance-authority";
import React from "react";
import { Pressable, PressableProps } from "react-native";

export const card = cva(
  "rounded-lg dark:bg-neutral-900 dark:border-neutral-800",
  {
    variants: {
      variant: {
        outlined: "border-[2px] border-gray-100",
        filled: null,
      },
      pressable: {
        true: "actie:bg-neutral-50 dark:active:bg-neutral-800",
      },
    },
    defaultVariants: {
      variant: "filled",
    },
  },
);

interface Props extends PressableProps, VariantProps<typeof card> {}

export function Card(props: Props) {
  const { className, pressable, variant, ...rest } = props;
  return (
    <Pressable className={card({ className, pressable, variant })} {...rest} />
  );
}
