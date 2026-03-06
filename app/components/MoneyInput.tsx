import React from "react";
import { Input } from "@/components/Input";
import { Text } from "@/components/Text";
import { TextInputProps, View } from "react-native";

export function MoneyInput(props: TextInputProps) {
  return (
    <View>
      <Input {...props} keyboardType="numeric" style={{ paddingLeft: 38 }} />
      <Text style={{ position: 'absolute', top: 18, left: 16 }}>
        $ 
      </Text>
    </View>
  );
}
