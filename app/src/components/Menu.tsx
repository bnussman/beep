import { Menu as HeroMenu, SubMenu } from "heroui-native";
import { Text } from "@/components/Text";
import { SFSymbolIcon } from "expo-router/unstable-native-tabs";
import { Pressable, useColorScheme } from "react-native";

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
   * An accessible label for the trigger
   */
  label?: string;
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

  const renderOption = (option: Option) => {
    if (option.show !== undefined && !option.show) {
      return null;
    }

    if (option.options) {
      return (
        <SubMenu key={option.title}>
          <SubMenu.Trigger textValue="Focus">
            <SubMenu.TriggerIndicator />
            <Text className="flex-1 text-base font-medium text-foreground">
              {option.title}
            </Text>
          </SubMenu.Trigger>
          <SubMenu.Content>{option.options.map(renderOption)}</SubMenu.Content>
        </SubMenu>
      );
    }

    return (
      <HeroMenu.Item key={option.title} onPress={option.onClick}>
        <HeroMenu.ItemTitle>{option.title}</HeroMenu.ItemTitle>
      </HeroMenu.Item>
    );
  };

  return (
    <HeroMenu isOpen>
      <HeroMenu.Trigger asChild>
        <Pressable>{props.trigger}</Pressable>
      </HeroMenu.Trigger>
      <HeroMenu.Portal>
        <HeroMenu.Overlay />
        <HeroMenu.Content presentation="popover" width={240}>
          {props.options.map(renderOption)}
        </HeroMenu.Content>
      </HeroMenu.Portal>
    </HeroMenu>
  );
};
