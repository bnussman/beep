import { useState } from "react";
import { MenuProps, Option } from "./Menu";
import {
  Host,
  Box,
  DropdownMenuPopup,
  DropdownMenuGroup,
  DropdownMenuItem,
  SelectableDropdownMenuItem,
  Spacer,
  Text,
  RNHostView,
} from "@expo/ui/jetpack-compose";
import { height, verticalScroll } from "@expo/ui/jetpack-compose/modifiers";

const DESTRUCTIVE_COLOR = "#d94e53";

interface MenuItemProps {
  option: Option;
  /**
   * Position of the item in its group, used for Material 3 Expressive item shapes
   */
  index: number;
  count: number;
  onOpenSubmenu: (option: Option) => void;
  onClose: () => void;
}

function MenuItem({ option, index, count, onOpenSubmenu, onClose }: MenuItemProps) {
  const shape = { index, count };

  const onClick = () => {
    if (!option.keepsMenuPresented) {
      onClose();
    }
    option.onClick?.();
  };

  if (option.options) {
    return (
      <DropdownMenuItem
        shape={shape}
        enabled={!option.disabled}
        onClick={() => onOpenSubmenu(option)}
      >
        <DropdownMenuItem.Text>
          <Text>{option.title}</Text>
        </DropdownMenuItem.Text>
        <DropdownMenuItem.TrailingIcon>
          <Text>›</Text>
        </DropdownMenuItem.TrailingIcon>
      </DropdownMenuItem>
    );
  }

  if (option.checked !== undefined) {
    return (
      <SelectableDropdownMenuItem
        shapes={shape}
        selected={option.checked}
        enabled={!option.disabled}
        onClick={onClick}
      >
        <SelectableDropdownMenuItem.Text>
          <Text>{option.title}</Text>
        </SelectableDropdownMenuItem.Text>
        <SelectableDropdownMenuItem.SelectedLeadingIcon>
          <Text>✓</Text>
        </SelectableDropdownMenuItem.SelectedLeadingIcon>
      </SelectableDropdownMenuItem>
    );
  }

  return (
    <DropdownMenuItem
      shape={shape}
      enabled={!option.disabled}
      onClick={onClick}
      elementColors={option.destructive ? { textColor: DESTRUCTIVE_COLOR } : undefined}
    >
      <DropdownMenuItem.Text>
        <Text>{option.title}</Text>
      </DropdownMenuItem.Text>
    </DropdownMenuItem>
  );
}

// Calling `trigger` inside its own component keeps any hooks it uses out of Menu's hook list
function Trigger(props: { trigger: MenuProps["trigger"]; onPress: () => void; onLongPress: () => void }) {
  return props.trigger({ onPress: props.onPress, onLongPress: props.onLongPress });
}

const isVisible = (option: Option) => option.show === undefined || option.show;

export function Menu(props: MenuProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  /**
   * Stack of submenus the user has drilled into. `DropdownMenuPopup` can't
   * anchor a nested popup beside its item yet, so submenus replace the menu's
   * contents and show a "back" item instead of cascading.
   */
  const [submenus, setSubmenus] = useState<Option[]>([]);

  const onClose = () => {
    setIsExpanded(false);
    setSubmenus([]);
  };

  const onLongPress = () => {
    if (props.activationMethod === "longPress") {
      setIsExpanded(true);
    }
  };

  const onPress = () => {
    if (props.activationMethod === undefined || props.activationMethod === "singlePress") {
      setIsExpanded(true);
    }
  };

  const submenu = submenus.at(-1);
  const options = (submenu?.options ?? props.options).filter(isVisible);

  return (
    <Host>
      <Box>
        <RNHostView>
          <Trigger trigger={props.trigger} onPress={onPress} onLongPress={onLongPress} />
        </RNHostView>
        <DropdownMenuPopup
          expanded={isExpanded}
          onDismissRequest={onClose}
          // Unlike the legacy DropdownMenu, DropdownMenuPopup does not scroll on its own
          modifiers={[verticalScroll()]}
        >
          {submenu && (
            <>
              <DropdownMenuGroup shapes={{ index: 0, count: 2 }}>
                <DropdownMenuItem
                  shape={{ index: 0, count: 1 }}
                  onClick={() => setSubmenus((stack) => stack.slice(0, -1))}
                >
                  <DropdownMenuItem.LeadingIcon>
                    <Text>‹</Text>
                  </DropdownMenuItem.LeadingIcon>
                  <DropdownMenuItem.Text>
                    <Text>{submenu.title}</Text>
                  </DropdownMenuItem.Text>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <Spacer modifiers={[height(2)]} />
            </>
          )}
          <DropdownMenuGroup shapes={submenu ? { index: 1, count: 2 } : undefined}>
            {options.map((option, index) => (
              <MenuItem
                key={option.title}
                option={option}
                index={index}
                count={options.length}
                onOpenSubmenu={(option) => setSubmenus((stack) => [...stack, option])}
                onClose={onClose}
              />
            ))}
          </DropdownMenuGroup>
        </DropdownMenuPopup>
      </Box>
    </Host>
  );
}
