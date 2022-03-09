import React from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { GetUserDataQuery, ResendEmailMutation } from '../generated/graphql';
import { Alert, AlertIcon, Box, Button, Spacer, useToast } from '@chakra-ui/react';
import { GetUserData } from '../App';

const Resend = gql`
  mutation ResendEmail {
    resendEmailVarification
  }
`;

export default function Banners() {
  const { data } = useQuery<GetUserDataQuery>(GetUserData);
  const [resend, { loading }] = useMutation<ResendEmailMutation>(Resend);
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
        <Alert status="error" mb={2} flexWrap="wrap">
          <AlertIcon />
          You need to verify your email!
          <Spacer />
          <Button
            isLoading={loading}
            onClick={resendVarificationEmail}
            colorScheme="red"
            ml={2}
          >
            Resend my verification email
          </Button>
        </Alert>
      </Box>
    );
  }

  return null;
}