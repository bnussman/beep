import React from "react";
import { Stack, StackProps } from "@beep/ui";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ScrollViewProps, useColorScheme } from "react-native";

interface Props extends StackProps {
  keyboard?: boolean;
  center?: boolean;
  scrollViewProps?: ScrollViewProps;
}

export const Container = (props: Props) => {
  const { children, keyboard, center, scrollViewProps, ...rest } = props;
  const colorScheme = useColorScheme();

  const centerProps = center
    ? { alignItems: "center", justifyContent: "center" } as const
    : {};

  if (keyboard) {
    return (
      <Stack h="100%" bg="white" $theme-dark={{ bg: "black" }}>
        <KeyboardAwareScrollView
          scrollEnabled={false}
          extraHeight={150}
          contentContainerStyle={
            center
              ? { height: "100%", justifyContent: "center" }
              : { justifyContent: "center", height: "100%" }
          }
          {...scrollViewProps}
        >
          <Stack flex={1} h="100%" {...centerProps} {...rest}>
            {children}
          </Stack>
        </KeyboardAwareScrollView>
      </Stack>
    );
  }

  return (
    <Stack flex={1} bg="white" $theme-dark={{ bg: "black" }} {...rest} {...centerProps}>
      {children}
    </Stack>
  );
};
