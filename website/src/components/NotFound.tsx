import React from 'react';
import { Alert, AlertDescription, AlertIcon, AlertTitle } from "@chakra-ui/react";

export function NotFound() {
  return (
    <Alert
      status='info'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      textAlign='center'
      height='calc(100vh - 100px)'
      bg="none"
    >
      <AlertIcon boxSize='50px' mr={0} />
      <AlertTitle mt={4} mb={1} fontSize='2xl'>
        Not found!
      </AlertTitle>
      <AlertDescription>
        This page does not exist
      </AlertDescription>
    </Alert>
  );
}