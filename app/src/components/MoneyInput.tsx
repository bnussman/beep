import { ComponentProps } from "react";
import { Text } from "@/components/Text";
import { Input, InputGroup } from "heroui-native";

export function MoneyInput(props: ComponentProps<typeof Input>) {
  return (
    <InputGroup>
      <InputGroup.Prefix>
        <Text>$</Text>
      </InputGroup.Prefix>
      <InputGroup.Input keyboardType="numeric" {...props} />
    </InputGroup>
  );
}
