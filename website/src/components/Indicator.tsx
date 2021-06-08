import { Icon } from "@chakra-ui/react";
import React from "react";

interface Props {
  color: 'red' | 'green';
}

export function Indicator(props: Props) {
  return (
    <Icon viewBox="0 0 200 200" color={`${props.color}.400`}>
      <path
        fill="currentColor"
        d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
      />
    </Icon>
  );
}