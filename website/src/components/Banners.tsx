import React from 'react';
import { Alert, AlertIcon, Box, Button, Spacer, useToast } from '@chakra-ui/react';
import { trpc } from '../utils/trpc';

export function Banners() {
  const { data: user } = trpc.user.me.useQuery(undefined, { retry: false, enabled: false });

  const {
    mutateAsync: resendVerifyEmail,
    isPending
  } = trpc.auth.resendVerification.useMutation();

  const toast = useToast();

  async function resendVarificationEmail() {
    try {
      await resendVerifyEmail();
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
            isLoading={isPending}
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
