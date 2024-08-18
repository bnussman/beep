import React from 'react';
import { Alert, AlertIcon } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface Props {
  message?: string | ReactNode;
  children?: string | ReactNode;
}

export function Success(props: Props) {
  return (
    <Alert status="success" variant="left-accent" mb={4}>
      <AlertIcon />
      {props.message ?? props.children}
    </Alert>
  );
}
