import { cx } from "class-variance-authority";
import React from "react";
import { Pressable, PressableProps } from "react-native";

export function Card(props: PressableProps) {
  const { className, ...rest } = props;
  return (
    <Pressable
      className={cx(
        "rounded-lg border-[2px] border-gray-100 dark:bg-neutral-900 dark:border-neutral-800",
        {
          "active:bg-gray-50 dark:active:bg-neutral-800": Boolean(
            props.onPress,
          ),
        },
        className,
      )}
      {...rest}
    />
  );
}
