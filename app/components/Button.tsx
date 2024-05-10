import { VariantProps, cva } from "class-variance-authority";
import { Pressable, PressableProps, ActivityIndicator } from "react-native";
import { Text } from "./Text";

export const button = cva(
  [
    "p-4 flex cursor-pointer items-center rounded-xl bg-neutral-100 active:bg-neutral-200 dark:bg-neutral-800 dark:active:bg-neutral-700 dark:hover:bg-neutral-700",
  ],
  {
    variants: {},
    defaultVariants: {},
  },
);

interface Props extends PressableProps, VariantProps<typeof button> {
  isLoading?: boolean;
}

export function Button(props: Props) {
  const { className, children, isLoading, ...rest } = props;

  return (
    <Pressable className={button({ className })} {...rest}>
      {isLoading ? <ActivityIndicator /> : typeof children === "string" ? (
        <Text weight="bold">{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
