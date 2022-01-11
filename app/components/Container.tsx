import React from "react";
import { Box, useColorModeValue, IBoxProps } from "native-base";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

interface Props {
  keyboard?: boolean;
  children: any;
}

export const Container = (props: Props & IBoxProps): JSX.Element => {
  const { children, keyboard, ...rest } = props;
  const bg = useColorModeValue("white", "black");

  if (keyboard) {
    return (
      <Box h="100%" bg={bg}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
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
