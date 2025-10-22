import { Host } from "@expo/ui/swift-ui";
import { Pressable as _Pressable, PressableProps } from "react-native";

export function Pressable(props: PressableProps) {
  return (
    <Host>
      <_Pressable {...props} />
    </Host>
  );
}
