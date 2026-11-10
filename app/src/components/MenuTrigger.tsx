import type { ButtonRootProps } from "heroui-native";
import { Platform, useColorScheme } from "react-native";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
// Use our Button wrapper (not heroui-native's directly): it maps `ghost` to
// `secondary` on web, where heroui's ghost hover color crashes in colorKit.
import { Button } from "./Button";

type Props = ButtonRootProps & {
  symbolViewProps?: Partial<SymbolViewProps>;
};

export function MenuTrigger({ symbolViewProps, style, ...props }: Props) {
  const colorScheme = useColorScheme();
  return (
    <Button
      variant="ghost"
      {...props}
      style={[{ paddingHorizontal: Platform.select({ ios: 6, android: 4, web: 16 }) }, style]}
    >
      <SymbolView
        name={{ ios: "ellipsis", android: "more_vert", web: "more_vert" }}
        size={24}
        tintColor={colorScheme === "dark" ? "#fff" : "#000"}
        {...symbolViewProps}
      />
    </Button>
  );
}
