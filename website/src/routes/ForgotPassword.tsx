import React, { FormEvent, useState } from 'react';
import { useMutation } from '@apollo/client';
import { Error } from '../components/Error';
import { Success } from '../components/Success';
import { Button, Center, Container, FormControl, FormHelperText, FormLabel, Heading, Input } from '@chakra-ui/react';
import { EmailIcon } from '@chakra-ui/icons';
import { Card } from '../components/Card';
import { createRoute } from '@tanstack/react-router';
import { graphql } from 'gql.tada';
import { rootRoute } from '../utils/router';

const ForgotPasswordGraphQL = graphql(`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email)
  }
`);

export const forgotPasswordRoute = createRoute({
  component: ForgotPassword,
  path: "/password/forgot",
  getParentRoute: () => rootRoute,
});

export function ForgotPassword() {
  const [forgot, { data, loading, error }] = useMutation(ForgotPasswordGraphQL);
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
    }
  }

  return (
    <Container maxW="container.sm" p={[0]}>
      <Card>
        <Center pb={4}>
          <Heading>Forgot Password</Heading>
        </Center>
        {error && <Error error={error} />}
        {data?.forgotPassword && <Success message="Successfully sent password reset email" />}
        <form onSubmit={handleForgotPassword}>
          <FormControl>
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              placeholder="example@ridebeep.app"
              onChange={(value: any) => setEmail(value.target.value)}
              isDisabled={data?.forgotPassword}
            />
            <FormHelperText>We'll send you an email with a link to reset your password.</FormHelperText>
          </FormControl>
          <Button
            w="full"
            mt={4}
            type="submit"
            rightIcon={<EmailIcon />}
            isLoading={loading}
            isDisabled={data?.forgotPassword || !email}
          >
            Send Reset Password Email
          </Button>
        </form>
      </Card>
    </Container>
  );
}
