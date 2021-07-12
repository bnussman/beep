import React, { FormEvent, useContext, useState } from 'react';
import { UserContext } from '../UserContext';
import { Redirect } from "react-router-dom";
import { gql, useMutation } from '@apollo/client';
import { ForgotPasswordMutation } from '../generated/graphql';
import { Error } from '../components/Error';
import { Success } from '../components/Success';
import { Box, Button, FormControl, FormHelperText, FormLabel, Input } from '@chakra-ui/react';
import { EmailIcon } from '@chakra-ui/icons';

const ForgotPasswordGraphQL = gql`
    mutation ForgotPassword($email: String!) {
        forgotPassword(email: $email)
    }
`;

function ForgotPassword() {
  const [forgot, { data, loading, error }] = useMutation<ForgotPasswordMutation>(ForgotPasswordGraphQL);
  const user = useContext(UserContext);
  const [email, setEmail] = useState("");

  async function handleForgotPassword(e: FormEvent): Promise<void> {
    e.preventDefault();
    try {
      await forgot({
        variables: {
          email: email
        }
      });
    }
    catch (error) {
      console.error('Error:', error);
    }
  }

  if (user) {
    return <Redirect to={{ pathname: "/" }} />;
  }

  return (
    <Box>
      {error && <Error error={error} />}
      {data?.forgotPassword && <Success message="Successfully sent password reset email" />}

      <form onSubmit={handleForgotPassword}>
        <FormControl>
          <FormLabel>Email address</FormLabel>
          <Input
            type="email"
            placeholder="example@ridebeep.app"
            onChange={(value: any) => setEmail(value.target.value)}
            disabled={data?.forgotPassword}
          />
          <FormHelperText>We'll send you an email with a link to reset your password.</FormHelperText>
        </FormControl>
        <Button
          type="submit"
          mt={4}
          rightIcon={<EmailIcon />}
          isLoading={loading}
          disabled={data?.forgotPassword || !email}
        >
          Send Reset Password Email
        </Button>
      </form>
    </Box>
  );
}

export default ForgotPassword;
