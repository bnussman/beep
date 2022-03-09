import React from "react";
import { Box, IBoxProps } from "native-base";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { isMobile } from "../utils/config";

interface Props {
  keyboard?: boolean;
}

export const Container = (props: Props & IBoxProps): JSX.Element => {
  const { children, keyboard, ...rest } = props;

  const onPress = () => {
    if (isMobile) {
      Keyboard.dismiss();
    }
  };

  if (keyboard) {
    return (
      <Box h="100%">
        <TouchableWithoutFeedback onPress={onPress}>
          <KeyboardAwareScrollView scrollEnabled={false} extraScrollHeight={70}>
            <Box flex={1} bg="white" _dark={{ bg: "black" }} {...rest}>
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
