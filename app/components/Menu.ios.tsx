import { Button, ContextMenu, Host } from "@expo/ui/swift-ui";
import { MenuProps } from "./Menu";
import { View } from "react-native";

export function Menu(props: MenuProps) {
  if (props.disabled) {
    return props.trigger;
  }

  return (
    <Host matchContents={{ horizontal: true, vertical: false }}>
      <ContextMenu activationMethod={props.activationMethod ?? "singlePress"}>
        <ContextMenu.Items>
          {props.options.map((option) => (
            <Button
              role={option.destructive ? "destructive" : undefined}
              onPress={option.onClick}
            >
              {option.title}
            </Button>
          ))}
        </ContextMenu.Items>
        <ContextMenu.Trigger>
          <View>
            <Host>{props.trigger}</Host>
          </View>
        </ContextMenu.Trigger>
      </ContextMenu>
    </Host>
  );
}
