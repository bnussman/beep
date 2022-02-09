import React, { useState } from "react";
import { TouchableWithoutFeedback } from "react-native";
import { Icon, IInputProps, Input } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function LocationInput(props: IInputProps) {
  const [show, setShow] = useState(false);

  const toggleShow = () => setShow((prev) => !prev);

  const ShowIcon = (
    <TouchableWithoutFeedback onPress={toggleShow}>
      <Icon
        mr={3}
        size="sm"
        as={<MaterialCommunityIcons name={show ? "eye-outline" : "eye-off"} />}
        _dark={{ color: "white" }}
      />
    </TouchableWithoutFeedback>
  );

  return (
    <Input {...props} InputRightElement={ShowIcon} secureTextEntry={!show} />
  );
}

export default React.forwardRef(LocationInput);
