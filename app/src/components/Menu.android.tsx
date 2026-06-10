import { MenuProps, Option } from "./Menu";
import { MenuAction, MenuView } from "@expo/ui/community/menu";

export function Menu(props: MenuProps) {
  const getOption = (option: Option): MenuAction => {
    if (option.options) {
      return {
        title: option.title,
        subactions: option.options.map(getOption),
      };
    }

    return {
      title: option.title,
      id: option.title,
    };
  };

  return (
    <MenuView
      actions={props.options.map(getOption)}
      shouldOpenOnLongPress={props.activationMethod === "longPress"}
      onPressAction={(e) => {
        const option = props.options.find(
          (option) => option.title === e.nativeEvent.event,
        );
        option?.onClick?.();
      }}
    >
      {props.trigger}
    </MenuView>
  );
}
