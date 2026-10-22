import React, { useState } from "react";
import { Input } from "./Input";
import { SymbolView } from 'expo-symbols';
import { Pressable, TextInput, TextInputProps, View } from "react-native";

interface Props extends TextInputProps {
  ref: React.Ref<TextInput>;
}

export function PasswordInput(props: Props) {
  const [show, setShow] = useState(false);

  const toggleShow = () => setShow((prev) => !prev);

  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      <Input
        style={{ flexGrow: 1, paddingRight: 52 }}
        textContentType="password"
        secureTextEntry={!show}
        {...props}
      />
      <View style={{ position: 'absolute', right: 16, top: 12, display: 'flex', alignContent: 'center', justifyContent: 'center', width: 28, height: 24 }}>
        <Pressable onPress={toggleShow} hitSlop={24}>
          <SymbolView
            name={{
              ios: show ? "eye.slash" : "eye",
              android: show ? "visibility_off" : "visibility",
              web: show ? "visibility_off" : "visibility",
            }}
            size={20}
          />
        </Pressable>
      </View>
    </View>
  );
}
