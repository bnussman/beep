import type { Props } from "./CurrentLocationButton";
import { Button, Host } from "@expo/ui/swift-ui";
import { fixedSize } from "@expo/ui/swift-ui/modifiers";
import { frame } from "@expo/ui/swift-ui/modifiers";
import { controlSize } from "@expo/ui/swift-ui/modifiers";
import { buttonStyle } from "@expo/ui/swift-ui/modifiers";
import { labelStyle, padding } from "@expo/ui/swift-ui/modifiers";

export function CurrentLocationButton(props: Props) {
  return (
    <Host matchContents>
      <Button
        onPress={props.onPress}
        systemImage="location.fill"
        label="My location"
        modifiers={[
          labelStyle('iconOnly'),
          buttonStyle('glass'),
          controlSize('mini'),
        ]}
      />
    </Host>
  );
}