import { SymbolView } from "expo-symbols";
import { useThemeColor } from "heroui-native";

export function Elipsis() {
  const foreground = useThemeColor("foreground");

  return (
    <SymbolView
      name={{ ios: 'ellipsis', android: 'more_vert', web: 'more_vert' }}
      size={24}
      tintColor={foreground}
    />
  );
}
