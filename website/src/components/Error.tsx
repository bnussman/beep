import React from 'react';
import { Text, Alert, AlertIcon, Box } from "@chakra-ui/react";

interface Props {
  error: any;
}

export function Error(props: Props) {
  const formatError = (error: string) => {
    return error.split(',');
  };

  return (
    <Alert status="error" mb={4}>
      <AlertIcon />
      <Box>
        {formatError(props.error.message).map((error) => 
          <Text>{error}</Text>
        )}
      </Box>
    </Alert>
  );
}

export default Error;