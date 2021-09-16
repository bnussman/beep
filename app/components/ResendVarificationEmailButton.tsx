import React from 'react';
import { Button } from '@ui-kitten/components';
import { EmailIcon, LoadingIndicator } from '../utils/Icons';
import { gql, useMutation } from '@apollo/client';
import { ResendMutation } from '../generated/graphql';

const Resend = gql`
    mutation Resend {
      resendEmailVarification
    }
`;

function ResendButton(): JSX.Element {
  const [resend, { loading }] = useMutation<ResendMutation>(Resend);

  async function resendEmailVarification() {
    try {
      await resend();
      alert("Successfuly resent varification email");
    }
    catch(error) {
      alert(error.message);
    }
  }

  if (loading) {
    return (
      <Button appearance='ghost' accessoryLeft={LoadingIndicator} style={{ marginBottom: 10 }}>
        Loading
      </Button>
    );
  }

  return (
    <Button
      onPress={() => resendEmailVarification()}
      accessoryLeft={EmailIcon}
      style={{ marginBottom: 10 }}
      appearance='ghost'
    >
      Resend Varification Email
    </Button>
  );
}

export default ResendButton;
