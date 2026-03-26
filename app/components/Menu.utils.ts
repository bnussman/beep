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
        items: options.map((option) => {
          if (option.options) {
            return {
              type: "submenu",
              label: option.title,
              icon: option.sfIcon ? { name: option.sfIcon, type: "sfSymbol" } : undefined,
              items: option.options.map((option) => ({
                label: option.title,
                type: "action",
                icon: option.sfIcon ? { name: option.sfIcon, type: "sfSymbol" } : undefined,
                destructive: option.destructive,
                onPress: option.onClick ?? (() => { }),
              }))
            };
          }
          return {
            label: option.title,
            type: "action",
            icon: option.sfIcon ? { name: option.sfIcon, type: "sfSymbol" } : undefined,
            destructive: option.destructive,
            onPress: option.onClick ?? (() => { }),
          }
        }),
      },
    },
  ];
}
