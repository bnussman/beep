import { Button, ContextMenu } from "@expo/ui/jetpack-compose";
import { MenuProps } from "./Menu";

export function Menu(props: MenuProps) {
  if (props.disabled) {
    return props.trigger;
  }

  return (
    <ContextMenu>
      <ContextMenu.Items>
        {props.options.map((option) => (
          <Button onPress={option.onClick}>{option.title}</Button>
        ))}
      </ContextMenu.Items>
      <ContextMenu.Trigger>{props.trigger}</ContextMenu.Trigger>
    </ContextMenu>
  );
}
