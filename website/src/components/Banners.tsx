import React from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Alert, AlertIcon, Box, Button, Spacer, useToast } from '@chakra-ui/react';
import { GetUserData } from '../App';
import { graphql } from 'gql.tada';

const Resend = graphql(`
  mutation ResendEmail {
    resendEmailVarification
  }
`);

export function Banners() {
  const { data } = useQuery(GetUserData);
  const [resend, { loading }] = useMutation(Resend);
  const toast = useToast();

  const user = data?.getUser;

  async function resendVarificationEmail() {
    try {
      await resend();
      toast({
        status: 'success',
        title: "Success",
        description: "Successfully resent verification email."
      });
    }
    catch (error: any) {
      toast({
        status: 'error',
        title: "Error",
        description: error.message
      });
    }
  }

  if (user && !user.isEmailVerified) {
    return (
      <Box mb={4}>
        <Alert status="error" mb={2}>
          <AlertIcon />
          Please verify your email
          <Spacer />
          <Button
            isLoading={loading}
            onClick={resendVarificationEmail}
            colorScheme="red"
          >
            Resend
          </Button>
        </Alert>
      </Box>
    );
  }

  return null;
}
