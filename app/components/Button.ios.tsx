import { useTheme } from "@/utils/theme";
import { Host, Button as IOSButton } from "@expo/ui/swift-ui";
import { buttonStyle, controlSize, frame } from "@expo/ui/swift-ui/modifiers";
import { Props } from "./Button";

export function Button(props: Props) {
  const {
    children,
    isLoading,
    variant = "primary",
    size = "md",
    color,
    activityIndicatorProps,
    ...rest
  } = props;

  const theme = useTheme();

  return (
    <Host matchContents style={{ width: '100%'}}>
        <IOSButton
          label={typeof children === 'string' ? children : 'Button'}
          onPress={rest.onPress}
          modifiers={[buttonStyle('glass'), controlSize('large')]}
        />
    </Host>
  );
}
