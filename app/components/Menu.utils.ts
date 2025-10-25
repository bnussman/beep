import type { NativeStackHeaderItem } from "@react-navigation/native-stack";
import type { Option } from "./Menu";

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
        items: options.map((option) => ({
          label: option.title,
          type: "action",
          onPress: option.onClick ?? (() => {}),
        })),
      },
    },
  ];
}
