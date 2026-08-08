import { useState } from "react";
import { MenuProps, Option } from "./Menu";
import {
  Host,
  DropdownMenu,
  DropdownMenuItem,
  Text,
  RNHostView,
} from '@expo/ui/jetpack-compose';

function MenuItem(option: Option) {
  const [submenuExpanded, setSubmenuExpanded] = useState(false);

  if (option.show !== undefined && !option.show) {
    return null;
  }

  if (option.options) {
    return (
      <DropdownMenu expanded={submenuExpanded} onDismissRequest={() => setSubmenuExpanded(false)}>
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
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenuItem
      enabled={!option?.disabled}
      onClick={option.onClick}
    >
      <DropdownMenuItem.Text>
        <Text>{option.title}</Text>
      </DropdownMenuItem.Text>
      {option.checked !== undefined && option.checked && (
        <DropdownMenuItem.TrailingIcon>
          <Text>✓</Text>
        </DropdownMenuItem.TrailingIcon>
      )}
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
    <Host matchContents>
      <DropdownMenu expanded={isExpanded} onDismissRequest={() => setIsExpanded(false)}>
        <DropdownMenu.Trigger>
          <RNHostView matchContents>
            {typeof props.trigger === 'object' ? props.trigger : props.trigger({ onPress, onLongPress })}
          </RNHostView>
        </DropdownMenu.Trigger>
        <DropdownMenu.Items>
          {props.options.map((option) => (
            <MenuItem
              key={option.title}
              {...option}
            />
          ))}
        </DropdownMenu.Items>
      </DropdownMenu>
    </Host>
  );
}
