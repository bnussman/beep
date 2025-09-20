import { ContextMenuProps } from "@expo/ui/swift-ui";

interface Option {
  title: string;
  onClick: () => void;
  destructive?: boolean;
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
