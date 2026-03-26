import { Host, Button as IOSButton, Text } from "@expo/ui/swift-ui";
import { buttonStyle, controlSize, frame, fixedSize, disabled } from "@expo/ui/swift-ui/modifiers";
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
        label={typeof children === 'string' ? children : 'Button'}
        onPress={rest.onPress as any}
        modifiers={[
          buttonStyle(variant === 'primary' ? 'glassProminent' : 'glass'),
          controlSize(size === 'sm' ? 'regular' : 'large'),
          fixedSize(),
          frame({ maxWidth: Infinity, alignment: 'trailing' }),
          ...(props.disabled ? [disabled()] : []),
        ]}
      >
        {typeof children === 'string' ? (
          <Text
            modifiers={[
              frame({ minWidth: 0, maxWidth: Infinity })
            ]}>
            {children}
          </Text>
          ) : undefined}
        </IOSButton>
    </Host>
  );
}
