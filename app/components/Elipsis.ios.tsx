import { HStack, Image } from "@expo/ui/swift-ui";
import { fixedSize, frame } from "@expo/ui/swift-ui/modifiers";

export function Elipsis() {
  return (
    <HStack modifiers={[fixedSize(), frame({ width: 16, height: 20 })]}>
      <Image systemName="ellipsis" size={24} />
    </HStack>
  );
}
