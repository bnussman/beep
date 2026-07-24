import { SFSymbolIcon } from "expo-router/unstable-native-tabs";
import { Menu as BaseMenu } from "@base-ui/react/menu";
import { ContextMenu } from "@base-ui/react/context-menu";
import { cx } from "tailwind-variants";

export interface Option {
  /**
   * The text content of the option
   */
  title: string;
  /**
   * An SF Symbol name to show alongside the option. Only works on iOS.
   *
   * @platform ios
   */
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
  const MenuComponent =
    props.activationMethod === "longPress" ? ContextMenu : BaseMenu;

  if (props.disabled) {
    return props.trigger;
  }

  const renderOption = (option: Option) => {
    if (option.show !== undefined && !option.show) {
      return null;
    }

    if (option.options) {
      return (
        <MenuComponent.SubmenuRoot key={option.title}>
          <MenuComponent.SubmenuTrigger className={itemClasses}>
            {option.title}
          </MenuComponent.SubmenuTrigger>
          <MenuComponent.Portal>
            <MenuComponent.Positioner>
              <MenuComponent.Popup className={popupClasses}>
                {option.options.map(renderOption)}
              </MenuComponent.Popup>
            </MenuComponent.Positioner>
          </MenuComponent.Portal>
        </MenuComponent.SubmenuRoot>
      );
    }

    if (option.checked !== undefined) {
      return (
        <MenuComponent.CheckboxItem
          key={option.title}
          checked={option.checked}
          onCheckedChange={option.onClick}
          className={itemClasses}
        >
          <MenuComponent.CheckboxItemIndicator className="mr-2">
            ✔️
          </MenuComponent.CheckboxItemIndicator>
          <span>{option.title}</span>
        </MenuComponent.CheckboxItem>
      );
    }

    return (
      <MenuComponent.Item
        onClick={option.onClick}
        className={cx(itemClasses, { "text-red-400": option.destructive })}
        disabled={option.disabled}
        key={option.title}
      >
        {option.title}
      </MenuComponent.Item>
    );
  };

  return (
    <MenuComponent.Root>
      <MenuComponent.Trigger className="*:w-full" aria-label={props.label}>
        {props.trigger}
      </MenuComponent.Trigger>
      <MenuComponent.Portal>
        <MenuComponent.Positioner>
          <MenuComponent.Popup className={popupClasses}>
            {props.options.map(renderOption)}
          </MenuComponent.Popup>
        </MenuComponent.Positioner>
      </MenuComponent.Portal>
    </MenuComponent.Root>
  );
};

const popupClasses =
  "bg-surface border-border border rounded-xl p-2 shadow min-w-[200px] max-h-[var(--available-height)] overflow-y-auto";
const itemClasses =
  "text-foreground p-2 cursor-pointer hover:bg-surface-hover rounded-xl";
