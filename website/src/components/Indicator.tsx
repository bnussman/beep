import { Box, BoxProps, Tooltip } from "@chakra-ui/react";
import React from "react";

interface Props extends BoxProps {
  color: string;
  tooltip?: string;
}

export function Indicator({ color, tooltip, ...rest }: Props) {
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
    if (color === "silver") {
      return "gray.400";
    }
    return `${color}.400`;
  };

  const getBorderProps = () => {
    if (color === "white") {
      return { borderWidth: 1 };
    }
    return {};
  };

  const I = 
    <Box display="inline-block" w={4} h={4} bgColor={getColor()} borderRadius="full" {...getBorderProps()} {...rest} />;

  if (tooltip) {
    return (
      <Tooltip label={tooltip} fontSize="lg" hasArrow>
        {I}
      </Tooltip>
    );
  }

  return I;
}
