import React, { useState } from "react";
import { Button } from "./Button";
import { Input } from "./Input";
import { TextInputProps, View } from "react-native";

interface Props extends TextInputProps {
  inputRef: any;
}

export function PasswordInput({ inputRef, ...props }: Props) {
  const [show, setShow] = useState(false);

  const toggleShow = () => setShow((prev) => !prev);

  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      <Input
        style={{ flexGrow: 1 }}
        ref={inputRef}
        textContentType="password"
        secureTextEntry={!show}
        {...props}
      />
      <Button onPress={toggleShow}>{show ? "🙈" : "👁️"}</Button>
    </View>
  );
}
