import { useTheme } from "@/utils/theme";
import { Host, Image } from "@expo/ui/swift-ui";
import { View } from "react-native";

export function Elipsis() {
  const theme = useTheme();
  return (
    <View hitSlop={20}>
      <Host style={{ width: 34, paddingVertical: 16, alignContent: "center" }}>
        <Image systemName="ellipsis" color={theme.text.primary} size={24} />
      </Host>
    </View>
  );
}
