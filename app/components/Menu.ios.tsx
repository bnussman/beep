import { Button, ContextMenu, Host } from "@expo/ui/swift-ui";
import { MenuProps } from "./Menu";
import { View } from "react-native";

export function Menu(props: MenuProps) {
  if (props.disabled) {
    return props.trigger;
  }

  const renderOption = (option: MenuProps["options"][number]) => {
    if (option.type === "submenu") {
      return (
        <ContextMenu key={option.title}>
          <ContextMenu.Items>
            {option.options?.map((subOption) => renderOption(subOption))}
          </ContextMenu.Items>
          <ContextMenu.Trigger>
            <Button>{option.title}</Button>
          </ContextMenu.Trigger>
        </ContextMenu>
      );
    }
    return (
      <Button
        key={option.title}
        role={option.destructive ? "destructive" : undefined}
        onPress={option.onClick}
      >
        {option.title}
      </Button>
    );
  };

  return (
    <Host matchContents={{ horizontal: true, vertical: false }}>
      <ContextMenu activationMethod={props.activationMethod ?? "singlePress"}>
        <ContextMenu.Items>
          {props.options
            .filter((option) => option.show === undefined || option.show)
            .map(renderOption)}
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
