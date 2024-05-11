import { Text as _Text, TextProps as _TextProps } from "react-native";
import React from "react";

import { cva, type VariantProps } from "class-variance-authority";

export type TextVariantProps = VariantProps<typeof text>;

export const text = cva(["text-black", "dark:text-white"], {
  variants: {
    size: {
      xs: ["text-xs"],
      sm: ["text-sm"],
      md: ["text-md"],
      lg: ["text-lg"],
      xl: ["text-xl"],
      "2xl": ["text-2xl"],
      "3xl": ["text-3xl"],
      "4xl": ["text-4xl"],
      "5xl": ["text-5xl"],
    },
    weight: {
      normal: ["font-normal"],
      bold: ["font-bold"],
      black: ["font-black"],
    },
    color: {
      subtle: ["text-slate-600", "dark:text-neutral-400"],
      error: ["text-red-600", "dark:!text-red-400"],
    },
  },
  defaultVariants: {
    size: "md",
    weight: "normal",
  },
});

export interface TextProps extends _TextProps, TextVariantProps {}

export const Text = React.forwardRef<_Text, TextProps>((props, ref) => {
  const { size, className, weight, color, ...rest } = props;

  if (Array.isArray(rest.children) && rest.children.every((c) => !c)) {
    return null;
  }

  if (rest.children === null || rest.children === undefined) {
    return null;
  }

  return (
    <_Text
      ref={ref}
      className={text({ size, className, weight, color })}
      {...rest}
    />
  );
});
