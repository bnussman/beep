import {
  Host,
  Menu as ExpoUIMenu,
  Button,
  RNHostView,
} from "@expo/ui/swift-ui";
import { MenuProps, Option } from "./Menu";
import type { JSX } from "react/jsx-runtime";
import { disabled } from "@expo/ui/swift-ui/modifiers";

export function Menu(props: MenuProps) {
  const renderOption = (option: Option) => {
    if (option.show !== undefined && !option.show) {
      return null;
    }

    if (option.options) {
      return (
        <ExpoUIMenu label={undefined}>
          {option.options.map(renderOption)}
        </ExpoUIMenu>
      );
    }

    return (
      <Button
        systemImage={option.sfIcon}
        label={option.title}
        onPress={option.onClick}
        modifiers={option.disabled ? [disabled()] : []}
        role={option.destructive ? "destructive" : undefined}
      />
    );
  };

  return (
    <Host matchContents>
      <ExpoUIMenu
        label={
          <RNHostView matchContents>{props.trigger as JSX.Element}</RNHostView>
        }
      >
        {props.options.map(renderOption)}
      </ExpoUIMenu>
    </Host>
  );
}
