import { Host, Button as IOSButton, Text, ProgressView, ZStack } from "@expo/ui/swift-ui";
import { buttonStyle, controlSize, frame, fixedSize, disabled, tint, resizable, hidden } from "@expo/ui/swift-ui/modifiers";
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

  return (
    <Host matchContents>
      <IOSButton
        onPress={rest.onPress as any}
        modifiers={[
          buttonStyle(variant === 'primary' ? 'glassProminent' : 'glass'),
          controlSize(size === 'sm' ? 'regular' : 'large'),
          fixedSize(),
          frame({ maxWidth: Infinity, alignment: 'trailing' }),
          ...(props.disabled ? [disabled()] : []),
          ...(props.color ? [tint(props.color)] : [])
        ]}
      >
        <ZStack>
          {isLoading && <ProgressView modifiers={[resizable(), controlSize('regular')]} />}
          {typeof children === 'string' ? (
            <Text
              modifiers={[
                frame({ minWidth: 0, maxWidth: Infinity }),
                ...(isLoading ? [hidden()] : [])
              ]}>
              {children}
            </Text>
          ) : undefined}
        </ZStack>
        </IOSButton>
    </Host>
  );
}
