import { Box, BoxProps, Tooltip, useTheme } from "@mui/material";
import React from "react";

interface Props extends BoxProps {
  color: string;
  tooltip?: string;
}

export function Indicator({ color, tooltip, ...rest }: Props) {
  const theme = useTheme();

  const getColor = () => {
    if (color === "green") {
      return theme.palette.success.light;
    }
    if (color === "red") {
      return theme.palette.error.light;
    }
    if (color === "yellow") {
      return theme.palette.warning.light;
    }
    if (color === "blue") {
      return theme.palette.info.light;
    }
    if (color === "silver") {
      return "gray";
    }
    return color;
  };

  const getBorderProps = () => {
    if (color === "white") {
      return { outline: 1 };
    }
    return {};
  };

  const I = (
    <Box
      sx={{
        display: "inline-block",
        width: "16px",
        height: "16px",
        backgroundColor: getColor(),
        borderRadius: "50%",
        ...getBorderProps(),
      }}
      {...rest}
    />
  );

  if (tooltip) {
    return (
      <Tooltip title={tooltip} arrow>
        {I}
      </Tooltip>
    );
  }

  return I;
}
