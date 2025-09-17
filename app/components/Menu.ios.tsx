import { Button, ContextMenu, Host } from "@expo/ui/swift-ui";
import { MenuProps } from "./Menu";

export function Menu(props: MenuProps) {
  return (
    <Host matchContents>
      <ContextMenu activationMethod="singlePress">
        <ContextMenu.Items>
          {props.options.map((option) => (
            <Button onPress={option.onClick}>{option.title}</Button>
          ))}
        </ContextMenu.Items>
        <ContextMenu.Trigger>{props.trigger}</ContextMenu.Trigger>
      </ContextMenu>
    </Host>
  );
}
