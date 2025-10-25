import * as DropdownMenu from "zeego/dropdown-menu";
import * as ContextMenu from "zeego/context-menu";

export interface Option {
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

export interface MenuProps {
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
  /**
   *
   */
  activationMethod?: "longPress" | "singlePress";
}

export const Menu = (props: MenuProps) => {
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
            {option.title}
          </Component.SubTrigger>
          <Component.SubContent>
            {option.options.map(renderOption)}
          </Component.SubContent>
        </Component.Sub>
      );
    }
    return (
      <Component.Item
        key={option.title}
        destructive={option.destructive}
        onSelect={option.onClick}
      >
        {option.title}
      </Component.Item>
    );
  };

  return (
    <Component.Root>
      <Component.Trigger>{props.trigger}</Component.Trigger>
      <Component.Content>{props.options.map(renderOption)}</Component.Content>
    </Component.Root>
  );
};
