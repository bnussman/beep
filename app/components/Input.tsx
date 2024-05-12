import { cx } from "class-variance-authority";
import React from "react";
import { TextInput, TextInputProps, useColorScheme } from "react-native";

export const Input = React.forwardRef<TextInput, TextInputProps>(
  (props, ref) => {
    const { className, ...rest } = props;
    const colorScheme = useColorScheme();
    return (
      <TextInput
        ref={ref}
        selectionColor={colorScheme === "dark" ? "white" : "black"}
        className={cx(
          "p-4 dark:text-white rounded-xl",
          {
            ["border-2 border-neutral-100"]: colorScheme === "light",
            ["bg-neutral-900"]: colorScheme === "dark",
          },
          className,
        )}
        {...rest}
      />
    );
  },
);
