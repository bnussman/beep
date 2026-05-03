import * as DropdownMenu from "zeego/dropdown-menu";
import * as ContextMenu from "zeego/context-menu";
import { isWeb } from "@/utils/constants";
import { SFSymbolIcon } from "expo-router/unstable-native-tabs";
import { useColorScheme } from "react-native";

export interface Option {
  /**
   * The text content of the option
   */
  title: string;
  sfIcon?: Extract<SFSymbolIcon["sf"], string>;
  /**
   * Called when the option is chosen/clicked/pressed
   */
  onClick?: () => void;
  /**
   * Makes the item show as destructive. (Red on iOS and Andriod)
   */
  destructive?: boolean;
  /**
   * Whether or not the option is disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * If provided, the option will only show if the value is truthy.
   * @default true
   */
  show?: boolean;
  /**
   * If you want the item to be a submenu, provide options
   */
  options?: Option[];
  checked?: boolean;
}

export interface MenuProps {
  /**
   * The trigger for the menu
   */
  trigger: React.ReactNode;
  /**
   * Options that render in the Menu
   */
  options: Option[];
  /**
   * If the Menu is disabled, the tigger will just be returned
   */
  disabled?: boolean;
  /**
   * If `singlePress` (or not provided), a dropdown menu is rendered
   * If `longPress`, a context menu is rendered
   */
  activationMethod?: "longPress" | "singlePress";
}

export const Menu = (props: MenuProps) => {
  const colorScheme = useColorScheme();

  if (props.disabled) {
    return props.trigger;
  }

  const Component =
    props.activationMethod === "longPress" ? ContextMenu : DropdownMenu;

  const renderOption = (option: Option) => {
    if (option.show !== undefined && !option.show) {
      return null;
    }

    if (option.options) {
      return (
        <Component.Sub>
          <Component.SubTrigger key={option.title}>
            <Component.ItemIcon
              ios={{ name: option.sfIcon }}
            ></Component.ItemIcon>
            <Component.ItemTitle>{option.title}</Component.ItemTitle>
          </Component.SubTrigger>
          <Component.SubContent>
            {option.options.map(renderOption)}
          </Component.SubContent>
        </Component.Sub>
      );
    }

    const C =
      option.checked !== undefined ? Component.CheckboxItem : Component.Item;

    const moreProps =
      option.checked !== undefined
        ? {
            onValueChange: option.onClick,
          }
        : {};

    return (
      <C
        value={option.checked ? "on" : "off"}
        key={option.title}
        destructive={isWeb ? undefined : option.destructive}
        disabled={option.disabled}
        onSelect={option.onClick}
        {...moreProps}
      >
        <Component.ItemIcon ios={{ name: option.sfIcon }}></Component.ItemIcon>
        <Component.ItemTitle
          className={
            isWeb
              ? colorScheme === "dark"
                ? "text-white"
                : "text-black"
              : undefined
          }
        >
          {option.title}
        </Component.ItemTitle>
      </C>
    );
  };

  return (
    <Component.Root>
      <Component.Trigger
        className={
          isWeb
            ? colorScheme === "dark"
              ? "text-white *:w-full"
              : "text-black *:w-full"
            : undefined
        }
      >
        {props.trigger}
      </Component.Trigger>
      <Component.Content>{props.options.map(renderOption)}</Component.Content>
    </Component.Root>
  );
};
