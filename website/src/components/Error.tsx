import React from 'react';
import { Alert, AlertIcon } from "@chakra-ui/react";

interface Props {
  error: any;
}

export function Error(props: Props) {
  return (
    <Alert status="error" mb={4}>
      <AlertIcon />
      {props.error.message}
    </Alert>
  );
}
