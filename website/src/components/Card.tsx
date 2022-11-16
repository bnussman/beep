import React from "react";
import { Box, BoxProps } from "@chakra-ui/react";

export function Card({ children, ...props }: BoxProps) {
  return (
    <Box
      p={8}
      borderRadius="xl"
      borderWidth="1px"
      _dark={{ bg: "rgb(20, 24, 28)", boxShadow: "none" }}
      {...props}
    >
      {children}
    </Box>
  );
}