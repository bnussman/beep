import React from "react";
import { Input } from "@/components/Input";
import { Text } from "@/components/Text";
import { TextInput, TextInputProps, View } from "react-native";

interface Props extends TextInputProps {
  ref: React.Ref<TextInput>;
}

export function MoneyInput(props: Props) {
  return (
    <View>
      <Input {...props} keyboardType="numeric" style={{ paddingLeft: 38 }} />
      <Text style={{ position: 'absolute', top: 18, left: 16 }}>
        $ 
      </Text>
    </View>
  );
}
