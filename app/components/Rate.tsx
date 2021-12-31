import React from "react";
import { ViewProps } from "react-native";
import { Flex, IconButton } from "native-base";
import { AntDesign } from "@expo/vector-icons";

export interface RateBarProps extends ViewProps {
  hint: string;
  value: number;
  onValueChange: (value: number) => void;
}

export const RateBar = (props: RateBarProps): React.ReactElement<ViewProps> => {
  const renderRateButtonElement = (value: number) => {
    const color: string = value <= props.value ? "gold" : "gray";

    return (
      <IconButton
        icon={<AntDesign name="star" size={24} color={color} />}
        key={value}
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
