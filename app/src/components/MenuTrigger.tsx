import { Button, ButtonRootProps, useThemeColor } from "heroui-native";
import { Platform } from "react-native";
import { SymbolView, type SymbolViewProps } from "expo-symbols";

type Props = ButtonRootProps &{
  symbolViewProps?: Partial<SymbolViewProps>;
}

export function MenuTrigger(props: Props) {
  const foreground = useThemeColor("foreground");

  return (
    <Button variant="ghost" {...props} style={{ paddingHorizontal: Platform.select({ ios: 6, android: 4, web: 16 }) }}>
      <SymbolView
        name={{ ios: 'ellipsis', android: 'more_vert', web: 'more_vert' }}
        size={24}
        tintColor={foreground}
        {...props.symbolViewProps}
      />
    </Button>
  );
}
