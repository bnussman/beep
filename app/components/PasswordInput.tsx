import React, { useState } from "react";
import { TouchableWithoutFeedback } from "react-native";
import { Icon, IInputProps, Input } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function PasswordInput(props: IInputProps, ref: any) {
  const [show, setShow] = useState(false);

  const toggleShow = () => setShow((prev) => !prev);

  const ShowIcon = (
    <TouchableWithoutFeedback onPress={toggleShow}>
      <Icon
        mr={3}
        size="lg"
        name={show ? "eye-outline" : "eye-off"}
        as={MaterialCommunityIcons}
        _dark={{ color: "white" }}
      />
    </TouchableWithoutFeedback>
  );

  return (
    <Input
      {...props}
      InputRightElement={ShowIcon}
      secureTextEntry={!show}
      ref={ref}
    />
  );
}

export default React.forwardRef(PasswordInput);
