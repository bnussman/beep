import React from 'react';
import { Alert, AlertIcon, Box } from "@chakra-ui/react";

interface Props {
  children?: JSX.Element | string;
}

export function Error({ children }: Props) {
  return (
    <Alert status="error" mb={4}>
      <AlertIcon />
      <Box>
        {children}
      </Box>
    </Alert>
  );
}
