import { VariantProps, cva } from "class-variance-authority";
import {
  Pressable,
  PressableProps,
  ActivityIndicator,
  ActivityIndicatorProps,
} from "react-native";
import { Text } from "./Text";

export const button = cva(["p-4 flex cursor-pointer items-center rounded-xl"], {
  variants: {
    size: {
      sm: "p-2",
      md: "p-4",
      lg: "p-6",
    },
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
    size: "md"
  },
});

interface Props extends PressableProps, VariantProps<typeof button> {
  isLoading?: boolean;
  activityIndicatorProps?: ActivityIndicatorProps;
}

export function Button(props: Props) {
  const {
    className,
    children,
    isLoading,
    variant,
    size,
    activityIndicatorProps,
    ...rest
  } = props;

  return (
    <Pressable
      accessibilityRole="button"
      className={button({ className, variant, size })}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator {...activityIndicatorProps} />
      ) : typeof children === "string" ? (
        <Text weight="black">{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
