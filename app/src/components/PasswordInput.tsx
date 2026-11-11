import { ComponentProps, useState } from "react";
import { SymbolView } from 'expo-symbols';
import { InputGroup } from 'heroui-native';
import { Pressable } from "react-native";

type Props = ComponentProps<typeof InputGroup.Input>;

export function PasswordInput(props: Props) {
  const [show, setShow] = useState(false);

  const toggleShow = () => setShow((prev) => !prev);

  return (
    <InputGroup>
      <InputGroup.Input
        textContentType="password"
        secureTextEntry={!show}
        {...props}
      />
      <InputGroup.Suffix>
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
      </InputGroup.Suffix>
    </InputGroup>
  );
}
