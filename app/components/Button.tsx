import { VariantProps, cva } from "class-variance-authority";
import { Pressable, PressableProps, ActivityIndicator } from "react-native";
import { Text } from "./Text";

export const button = cva(["p-4 flex cursor-pointer items-center rounded-xl"], {
  variants: {
    variant: {
      parimary: [
        "bg-neutral-100",
        "active:bg-neutral-200",
        "dark:bg-neutral-900",
        "dark:active:bg-neutral-800",
        "dark:hover:bg-neutral-700",
      ],
      secondary: ["active:bg-neutral-100", "dark:active:bg-neutral-900"],
    },
  },
  defaultVariants: {
    variant: "parimary",
  },
});

interface Props extends PressableProps, VariantProps<typeof button> {
  isLoading?: boolean;
}

export function Button(props: Props) {
  const { className, children, isLoading, variant, ...rest } = props;

  return (
    <Pressable
      accessibilityRole="button"
      className={button({ className, variant })}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator />
      ) : typeof children === "string" ? (
        <Text weight="black">{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
