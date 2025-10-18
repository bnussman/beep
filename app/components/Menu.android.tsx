import { MenuProps } from "./Menu";

import { MenuView } from "@react-native-menu/menu";
import { View } from "react-native";

export function Menu(props: MenuProps) {
  if (props.disabled) {
    return props.trigger;
  }

  return (
    <View>
      <MenuView
        onPressAction={({ nativeEvent }) => {
          const option = props.options.find(
            (option) => option.title === nativeEvent.event,
          );
          option?.onClick?.();
        }}
        actions={props.options
          .filter((option) => option.show === undefined || option.show)
          .map((option) => ({
            id: option.title,
            title: option.title,
            attributes: option.destructive ? { destructive: true } : {},
            subactions: option.options?.map((o) => ({
              id: option.title,
              title: option.title,
              attributes: option.destructive ? { destructive: true } : {},
            })),
          }))}
        shouldOpenOnLongPress={props.activationMethod === "longPress"}
      >
        {props.trigger}
      </MenuView>
    </View>
  );
}
