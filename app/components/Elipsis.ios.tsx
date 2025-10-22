import { useTheme } from "@/utils/theme";
import { Host, Image } from "@expo/ui/swift-ui";
import { View, Text } from "react-native";

export function Elipsis() {
  const theme = useTheme();
  return (
    <Host style={{ width: 12, paddingVertical: 16, alignContent: "center" }}>
      <Image systemName="ellipsis" color={theme.text.primary} size={24} />
    </Host>
  );
}
