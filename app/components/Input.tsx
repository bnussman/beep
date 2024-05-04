import { cx } from "class-variance-authority";
import { TextInput, TextInputProps, useColorScheme } from "react-native";

export function Input(props: TextInputProps) {
  const { className, ...rest } = props;
  const colorScheme = useColorScheme();
  return (
    <TextInput
      selectionColor={colorScheme === "dark" ? "white" : "black"}
      className={cx(
        "py-3 px-4 dark:text-white bg-neutral-100 rounded dark:bg-neutral-900",
        className,
      )}
      {...rest}
    />
  );
}
