import React, { useContext, useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { ResendEmailMutation } from '../generated/graphql';
import { UserContext } from '../UserContext';
import { Alert, AlertIcon, Box, Button, Spacer } from '@chakra-ui/react';

const Resend = gql`
  mutation ResendEmail {
    resendEmailVarification
  }
`;

export default function Banners() {
  const [resend, { loading }] = useMutation<ResendEmailMutation>(Resend);
  const [resendStatus, setResendStatus] = useState<string>();;
  const user = useContext(UserContext);

  async function resendVarificationEmail() {
    try {
      await resend();
      setResendStatus("Successfully resent email");
    }
    catch (error: any) {
      setResendStatus(error.message);
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
              isDisabled={resendStatus?.includes("Success")}
              onClick={resendVarificationEmail}
              colorScheme="red"
              ml={2}
          >
            Resend my verification email
          </Button>
        </Alert>
        {resendStatus &&
          <Alert status="info" onClick={() => { setResendStatus(undefined) }}>
            <AlertIcon />
            {resendStatus}
          </Alert>
        }
      </Box>
    );
  }
  return null;
}
