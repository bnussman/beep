import { useState } from "react";
import { MenuProps, Option } from "./Menu";
import {
  Host,
  DropdownMenu,
  DropdownMenuItem,
  Text,
  RNHostView,
  Box,
  DropdownMenuPopup,
  DropdownMenuGroup,
  SelectableDropdownMenuItem,
  Icon,
} from '@expo/ui/jetpack-compose';

function MenuItem(option: Option) {
  const [submenuExpanded, setSubmenuExpanded] = useState(false);

  if (option.show !== undefined && !option.show) {
    return null;
  }

  if (option.options) {
    return (
      <DropdownMenuPopup expanded={submenuExpanded} onDismissRequest={() => setSubmenuExpanded(false)}>
        <DropdownMenu.Trigger>
          <DropdownMenuItem
            enabled={!option.disabled}
            onClick={() => setSubmenuExpanded(true)}>
              <DropdownMenuItem.Text>
                <Text>{option.title}</Text>
              </DropdownMenuItem.Text>
            </DropdownMenuItem>
        </DropdownMenu.Trigger>
        <DropdownMenu.Items>
          {option.options.map((option) => (
            <MenuItem
              key={option.title}
              {...option}
            />
          ))}
        </DropdownMenu.Items>
      </DropdownMenuPopup>
    );
  }

  if (option.checked !== undefined) {
    return (
      <SelectableDropdownMenuItem
        selected={option.checked}
        onClick={option.onClick}>
        <SelectableDropdownMenuItem.Text>
          <Text>{option.title}</Text>
        </SelectableDropdownMenuItem.Text>
        <SelectableDropdownMenuItem.SelectedLeadingIcon>
          <Icon source={require('./assets/check.xml')} size={20} />
        </SelectableDropdownMenuItem.SelectedLeadingIcon>
      </SelectableDropdownMenuItem>
    )
  }

  return (
    <DropdownMenuItem
      enabled={!option?.disabled}
      onClick={option.onClick}
      elementColors={option.destructive ? { textColor: '#d94e53' } : undefined}
    >
      <DropdownMenuItem.Text>
        <Text>{option.title}</Text>
      </DropdownMenuItem.Text>
    </DropdownMenuItem>
  );
}

export function Menu(props: MenuProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const onLongPress = () => {
    if (props.activationMethod === 'longPress') {
      setIsExpanded(true)
    }
  };

  const onPress = () => {
    if (props.activationMethod === undefined || props.activationMethod === 'singlePress') {
      setIsExpanded(true);
    }
  }

  return (
    <Host>
      <Box>
        <RNHostView>
          {props.trigger({ onPress, onLongPress })}
        </RNHostView>
      </Box>
      <DropdownMenuPopup
        expanded={isExpanded}
        onDismissRequest={() => setIsExpanded(false)}
      >
        <DropdownMenuGroup>
          {props.options.map((option) => (
            <MenuItem key={option.title} {...option} />
          ))}
        </DropdownMenuGroup>
      </DropdownMenuPopup>
    </Host>
  );
}
