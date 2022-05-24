import React from "react";
import { Box, IBoxProps } from "native-base";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ScrollViewProps } from "react-native";

interface Props {
  keyboard?: boolean;
  center?: boolean;
  scrollViewProps?: ScrollViewProps;
}

export const Container = (props: Props & IBoxProps): JSX.Element => {
  const { children, keyboard, center, scrollViewProps, ...rest } = props;

  const centerProps = center
    ? { alignItems: "center", justifyContent: "center" }
    : {};

  if (keyboard) {
    return (
      <Box h="100%" bg="white" _dark={{ bg: "black" }}>
        <KeyboardAwareScrollView
          scrollEnabled={false}
          extraHeight={100}
          contentContainerStyle={
            center
              ? {
                  height: "100%",
                  justifyContent: "center",
                }
              : undefined
          }
          {...scrollViewProps}
        >
          <Box flex={1} h="100%" {...centerProps} {...rest}>
            {children}
          </Box>
        </KeyboardAwareScrollView>
      </Box>
    );
  }

  return (
    <Box flex={1} bg="white" _dark={{ bg: "black" }} {...rest}>
      {children}
    </Box>
  );
};
