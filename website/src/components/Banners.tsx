import React, { useContext, useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { ResendEmailMutation } from '../generated/graphql';
import { UserContext } from '../UserContext';
import { Alert, AlertIcon, Box, Button } from '@chakra-ui/react';

const Resend = gql`
  mutation ResendEmail {
    resendEmailVarification
  }
`;

export default function Banners() {
  const [resend, { loading }] = useMutation<ResendEmailMutation>(Resend);
  const [resendStatus, setResendStatus] = useState<string>();;
  const [refreshStatus, setRefreshStatus] = useState<string>();
  const user = useContext(UserContext);

  async function resendVarificationEmail() {
    try {
      await resend();
      setResendStatus("Successfully resent email");
    }
    catch (error) {
      setResendStatus(error.message);
    }
  }

  if (user && !user.isEmailVerified) {
    return (
      <Box mb={4}>
        <Alert status="error" mb={2}>
          <AlertIcon />
          You need to verify your email!
          <Button isLoading={loading} variant="link" onClick={resendVarificationEmail} ml={2}>
            Resend my verification email
          </Button>
        </Alert>
        {refreshStatus &&
          <Alert status="info" onClick={() => { setRefreshStatus(undefined) }}>
            <AlertIcon />
            {refreshStatus}
          </Alert>
        }
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
