import React from 'react';
import { useMutation } from '@apollo/client';
import { Alert, AlertIcon, Box, Button, Spacer, useToast } from '@chakra-ui/react';
import { graphql } from 'gql.tada';
import { trpc } from '../utils/trpc';

const Resend = graphql(`
  mutation ResendEmail {
    resendEmailVarification
  }
`);

export function Banners() {
  const { data: user } = trpc.user.me.useQuery(undefined, { enabled: false });
  const [resend, { loading }] = useMutation(Resend);
  const toast = useToast();

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
