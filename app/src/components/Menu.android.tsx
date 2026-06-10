import { MenuProps, Option } from "./Menu";
import { MenuAction, MenuView } from "@expo/ui/community/menu";

export function Menu(props: MenuProps) {
  const getOption = (option: Option): MenuAction | null => {
    if (option.show !== undefined && !option.show) {
      return null;
    }

    if (option.options) {
      return {
        title: option.title,
        subactions: option.options.map(getOption).filter(Boolean) as MenuAction[],
      };
    }

    return {
      title: option.title,
      id: option.title,
      titleColor: option.destructive ? "red" : undefined,
    };
  };

  const findOption = (options: Option[], title: string): Option | undefined => {
    for (const option of options) {
      if (option.title === title) {
        return option;
      }

      if (option.options) {
        const found = findOption(option.options, title);
        if (found) {
          return found;
        }
      }
    }

    return undefined;
  };

  return (
    <MenuView
      actions={props.options.map(getOption).filter(Boolean) as MenuAction[]}
      shouldOpenOnLongPress={props.activationMethod === "longPress"}
      onPressAction={(e) => {
        const option = findOption(props.options, e.nativeEvent.event);
        option?.onClick?.();
      }}
    >
      {props.trigger}
    </MenuView>
  );
}
