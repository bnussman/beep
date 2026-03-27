import type { Props } from "./CurrentLocationButton";
import { Image, Button, Host } from "@expo/ui/swift-ui";
import { controlSize, buttonStyle, labelStyle, resizable, frame } from "@expo/ui/swift-ui/modifiers";

export function CurrentLocationButton(props: Props) {
  return (
    <Host matchContents>
      <Button
        onPress={props.onPress}
        modifiers={[
          labelStyle('iconOnly'),
          buttonStyle('glassProminent'),
          controlSize('mini'),
        ]}
      >
        <Image
          systemName="location.fill"
          size={16}
          modifiers={[
            frame({ width: 8, height: 16 }),
            resizable(),
          ]}
        />
      </Button>
    </Host>
  );
}