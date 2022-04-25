import React from "react";
import { Box, IBoxProps } from "native-base";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { isMobile } from "../utils/constants";

interface Props {
  keyboard?: boolean;
  center?: boolean;
}

export const Container = (props: Props & IBoxProps): JSX.Element => {
  const { children, keyboard, center, ...rest } = props;

  const onPress = () => {
    if (isMobile) {
      Keyboard.dismiss();
    }
  };

  const centerProps = center
    ? { alignItems: "center", justifyContent: "center" }
    : {};

  if (keyboard) {
    return (
      <Box h="100%" bg="white" _dark={{ bg: "black" }}>
        <TouchableWithoutFeedback onPress={onPress}>
          <KeyboardAwareScrollView
            scrollEnabled={false}
            extraScrollHeight={70}
            contentContainerStyle={
              center
                ? {
                    height: "100%",
                    justifyContent: "center",
                  }
                : undefined
            }
          >
            <Box flex={1} h="100%" {...centerProps} {...rest}>
              {children}
            </Box>
          </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
      </Box>
    );
  }

  return (
    <Box flex={1} bg="white" _dark={{ bg: "black" }} {...rest}>
      {children}
    </Box>
  );
};
