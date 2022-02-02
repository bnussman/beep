import { Icon, IconProps } from "@chakra-ui/react";
import React from "react";

interface Props extends IconProps {
  color: 'red' | 'green';
}

export function Indicator({ color, ...rest }: Props) {
  return (
    <Icon viewBox="0 0 200 200" color={`${color}.400`} {...rest}>
      <path
        fill="currentColor"
        d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
      />
    </Icon>
  );
}