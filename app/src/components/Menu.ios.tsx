import {
  Host,
  Menu as ExpoUIMenu,
  Button,
  RNHostView,
  ContextMenu,
} from "@expo/ui/swift-ui";
import { MenuProps, Option } from "./Menu";
import type { JSX } from "react/jsx-runtime";
import { disabled, fixedSize } from "@expo/ui/swift-ui/modifiers";

export function Menu(props: MenuProps) {
  const renderMenuOption = (option: Option) => {
    if (option.show !== undefined && !option.show) {
      return null;
    }

    if (option.options) {
      return (
        <ExpoUIMenu
          key={option.title}
          label={option.title}
          systemImage={option.sfIcon}
        >
          {option.options.map(renderMenuOption)}
        </ExpoUIMenu>
      );
    }

    return (
      <Button
        key={option.title}
        systemImage={option.sfIcon}
        label={option.title}
        onPress={option.onClick}
        modifiers={option.disabled ? [disabled()] : []}
        role={option.destructive ? "destructive" : undefined}
      />
    );
  };

  if (props.activationMethod === "longPress") {
    return (
      <Host matchContents modifiers={[fixedSize()]}>
        <ContextMenu>
          <ContextMenu.Trigger>
            <RNHostView matchContents>
              {props.trigger as JSX.Element}
            </RNHostView>
          </ContextMenu.Trigger>
          <ContextMenu.Items>
            {props.options.map(renderMenuOption)}
          </ContextMenu.Items>
        </ContextMenu>
      </Host>
    );
  }

  return (
    <Host matchContents>
      <ExpoUIMenu
        label={
          <RNHostView matchContents>{props.trigger as JSX.Element}</RNHostView>
        }
      >
        {props.options.map(renderMenuOption)}
      </ExpoUIMenu>
    </Host>
  );
}
