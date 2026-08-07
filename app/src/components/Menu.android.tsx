import { useState } from "react";
import { MenuProps, Option } from "./Menu";
import {
  Host,
  DropdownMenu,
  DropdownMenuItem,
  OutlinedButton,
  Text,
  RNHostView,
  Icon,
  Box,
  Button,
  Column,
} from '@expo/ui/jetpack-compose';
import { Pressable, View } from "react-native";
import { background, combinedClickable } from "@expo/ui/jetpack-compose/modifiers";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { scheduleOnRN} from "react-native-worklets";

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

  const open = () => {
    setIsExpanded(true)
  };

  const isOnPress = props.activationMethod === undefined || props.activationMethod === 'singlePress';


  // Define the parent long press gesture
  const longPressGesture = Gesture.LongPress()
    .onStart(() => {
      scheduleOnRN(() => open());
    });

  // Define child tap gesture and make it fail if long press activates
  const tapGesture = Gesture.Tap()
    .onEnd(() => {
      scheduleOnRN(() => open());
    });

  return (
    <Host matchContents>
      <DropdownMenu expanded={isExpanded} onDismissRequest={() => setIsExpanded(false)}>
        <DropdownMenu.Trigger>
          <RNHostView matchContents>
            <GestureDetector gesture={props.activationMethod === 'longPress' ? longPressGesture : tapGesture}>
            <Pressable
              onPress={isOnPress ? open : undefined}
              onLongPress={props.activationMethod === 'longPress' ? open : undefined}

            >
              <View pointerEvents={props.activationMethod === 'longPress' ? undefined : "none"}>
                {props.trigger}
              </View>
              </Pressable>
            </GestureDetector>
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
