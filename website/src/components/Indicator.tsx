import { Box, BoxProps } from "@chakra-ui/react";
import React from "react";

interface Props extends BoxProps {
  color: string;
}

export function Indicator({ color, ...rest }: Props) {

  const getColor = () => {
    if (color === "white") {
      return "white";
    }
    if (color === "black") {
      return "black";
    }
    if (color === "tan") {
      return "tan";
    }
    return `${color}.400`;
  };

  const getBorderProps = () => {
    if (color === "white") {
      return { borderWidth: 1 };
    }
    return {};
  };

  return (
    <Box display="inline-flex" w={4} h={4} bgColor={getColor()} borderRadius="full" {...getBorderProps()} {...rest} />
  );
}
