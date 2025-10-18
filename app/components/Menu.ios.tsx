import { Button, ContextMenu, Host, Submenu } from "@expo/ui/swift-ui";
import { MenuProps } from "./Menu";
import { View } from "react-native";

export function Menu(props: MenuProps) {
  if (props.disabled) {
    return props.trigger;
  }

  const renderOption = (option: MenuProps["options"][number]) => {
    if (option.type === "submenu") {
      return (
        <Submenu button={<Button>{option.title}</Button>} key={option.title}>
          {option.options?.map((subOption) => renderOption(subOption))}
        </Submenu>
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
