import { ContextMenuProps } from "@expo/ui/swift-ui";

interface Option {
  /**
   * The text content of the option
   */
  title: string;
  /**
   * Called when the option is chosen/clicked/pressed
   */
  onClick?: () => void;
  /**
   * Makes the item show as destructive. (Red on iOS and Andriod)
   */
  destructive?: boolean;
  /**
   * If provided, the option will only show if show is true.
   * @default true
   */
  show?: boolean;
  /**
   * @default button
   */
  type?: "button" | "submenu";
  /**
   * Only works if type is `submenu`
   */
  options?: Option[];
}

export interface MenuProps extends Omit<ContextMenuProps, "children"> {
  /**
   * The trigger for the men
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
}

export const Menu = (props: MenuProps) => {
  return props.trigger;
};
