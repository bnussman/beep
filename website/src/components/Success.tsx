import React from 'react';
import { Alert, AlertIcon } from '@chakra-ui/react';

interface Props {
  message: string;
}

export function Success(props: Props) {
  return (
    <Alert status="success" variant="left-accent" mb={4}>
      <AlertIcon />
      {props.message}
    </Alert>
  );
}
