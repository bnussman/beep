import React from 'react';
import { Text, Alert, AlertIcon, Box } from "@chakra-ui/react";
import { ApolloError } from '@apollo/client';

interface Props {
  error?: ApolloError;
  children?: JSX.Element | string;
}

export function Error({ error, children }: Props) {

  if (error?.message === 'Validation Error') {
    const errors = error?.graphQLErrors[0]?.extensions;

    return (
      <Alert status="error" mb={4}>
        <AlertIcon />
        <Box>
          {Object.keys(errors).map(key => {
            return <Text>{errors[key][0]}</Text>;
          })}
        </Box>
      </Alert>
    );
  }

  if (children) {
    return (
      <Alert status="error" mb={4}>
        <AlertIcon />
        <Box>
          {children}
        </Box>
      </Alert>
    );
  }

  return (
    <Alert status="error" mb={4}>
      <AlertIcon />
      <Box>
        {error?.message}
      </Box>
    </Alert>
  );
}

export default Error;