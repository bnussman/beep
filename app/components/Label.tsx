import { Text, TextProps } from "./Text";

export function Label(props: TextProps) {
  return <Text weight="bold" className="py-2" {...props} />;
}
