import React from "react";
import { Box, useColorModeValue, IBoxProps } from "native-base";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { isMobile } from "../utils/config";

interface Props {
  keyboard?: boolean;
  children: any;
}

export const Container = (props: Props & IBoxProps): JSX.Element => {
  const { children, keyboard, ...rest } = props;
  const bg = useColorModeValue("white", "black");

  const onPress = () => {
    if (isMobile) {
      Keyboard.dismiss();
    }
  };

  if (keyboard) {
    return (
      <Box h="100%" bg={bg}>
        <TouchableWithoutFeedback onPress={onPress}>
          <KeyboardAwareScrollView scrollEnabled={false} extraScrollHeight={70}>
            <Box flex={1} bg={bg} {...rest}>
              {children}
            </Box>
          </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
      </Box>
    );
  }

  return (
    <Box flex={1} bg={bg} {...rest}>
      {children}
    </Box>
  );
};
