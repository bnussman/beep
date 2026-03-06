import React, { useState } from "react";
import { Text } from "./Text";
import { Input } from "./Input";
import { Pressable, TextInputProps, View } from "react-native";

interface Props extends TextInputProps {
  inputRef: any;
}

export function PasswordInput({ inputRef, ...props }: Props) {
  const [show, setShow] = useState(false);

  const toggleShow = () => setShow((prev) => !prev);

  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      <Input
        style={{ flexGrow: 1, paddingRight: 52 }}
        ref={inputRef}
        textContentType="password"
        secureTextEntry={!show}
        {...props}
      />
      <View style={{ position: 'absolute', right: 16, top: 12, display: 'flex', alignContent: 'center', justifyContent: 'center', width: 28, height: 24 }}>
        <Pressable onPress={toggleShow} hitSlop={24}>
          <Text size="2xl">
            {show ? "🙈" : "👁️"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
