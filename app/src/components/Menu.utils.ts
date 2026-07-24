import { NativeStackHeaderItem, NativeStackHeaderItemMenuAction, NativeStackHeaderItemMenuSubmenu } from "expo-router/build/react-navigation/native-stack";
import type { Option } from "./Menu";

export function getNativeNavigationMenuItem(option: Option): NativeStackHeaderItemMenuAction | NativeStackHeaderItemMenuSubmenu {
  if (option.options) {
    return {
      type: "submenu",
      multiselectable: true,
      label: option.title,
      icon: option.sfIcon ? { name: option.sfIcon, type: "sfSymbol" } : undefined,
      items: option.options.map(getNativeNavigationMenuItem)
    };
  }

  return {
    label: option.title,
    type: "action",
    keepsMenuPresented: true,
    state: option.checked !== undefined ? option.checked ? 'on' : 'off' : undefined,
    icon: option.sfIcon
    ? { name: option.sfIcon, type: "sfSymbol" }
    : undefined,
    destructive: option.destructive,
    onPress: option.onClick ?? (() => {}),
  };
}

export function getNavigationMenuFromOptions(
  options: Option[],
): NativeStackHeaderItem[] {
  return [
    {
      type: "menu",
      label: "idk",
      icon: { name: "ellipsis", type: "sfSymbol" },
      menu: {
        title: "",
        multiselectable: true,
        items: options.map(getNativeNavigationMenuItem)
      },
    },
  ];
}
