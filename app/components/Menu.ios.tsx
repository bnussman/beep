import { MenuProps } from "./Menu";
import {
  ContextMenuButton,
  ContextMenuView,
  // @ts-expect-error bro...
} from "react-native-ios-context-menu";

export function Menu(props: MenuProps) {
  if (props.disabled) {
    return props.trigger;
  }

  const Component =
    props.activationMethod === "longPress"
      ? ContextMenuView
      : ContextMenuButton;

  return (
    <Component
      menuConfig={{
        menuTitle: "",
        menuItems: props.options
          .filter(
            (o) => o.show === undefined || (o.show !== undefined && o.show),
          )
          .map((option) => ({
            menuAttributes: option.destructive ? ["destructive"] : [],
            actionKey: option.title,
            actionTitle: option.title,
            menuTitle: option.options ? option.title : undefined,
            menuItems: option.options?.map((option) => ({
              menuAttributes: option.destructive ? ["destructive"] : [],
              actionKey: option.title,
              actionTitle: option.title,
            })),
          })),
      }}
      // @ts-expect-error bro...
      onPressMenuItem={({ nativeEvent }) => {
        const option = props.options.find(
          (o) => o.title === nativeEvent.actionTitle,
        );
        option?.onClick?.();
      }}
    >
      {props.trigger}
    </Component>
  );
}
