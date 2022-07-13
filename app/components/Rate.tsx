import React from "react";
import { Flex, Icon, IconButton } from "native-base";
import { AntDesign } from "@expo/vector-icons";

export interface RateBarProps {
  hint: string;
  value: number;
  onValueChange: (value: number) => void;
}

export const RateBar = (props: RateBarProps) => {
  const renderRateButtonElement = (value: number) => {
    const color: string = value <= props.value ? "gold" : "gray.400";

    return (
      <IconButton
        icon={<Icon as={AntDesign} name="star" />}
        key={value}
        size="lg"
        _icon={{ color }}
        onPress={() => props.onValueChange(value)}
      />
    );
  };

  const { ...restProps } = props;

  return (
    <Flex {...restProps} direction="row">
      {[1, 2, 3, 4, 5].map(renderRateButtonElement)}
    </Flex>
  );
};
