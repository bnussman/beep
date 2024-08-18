import React, {  } from 'react';
import { Error } from '../components/Error';
import { Success } from '../components/Success';
import { Text, Button, Center, Code, Container, FormControl, FormErrorMessage, FormHelperText, FormLabel, Heading, Input } from '@chakra-ui/react';
import { Card } from '../components/Card';
import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../utils/router';
import { RouterInput, trpc } from '../utils/trpc';
import { useForm } from 'react-hook-form';

export const forgotPasswordRoute = createRoute({
  component: ForgotPassword,
  path: "/password/forgot",
  getParentRoute: () => rootRoute,
});

export function ForgotPassword() {
  const {
    mutateAsync: sendForgotPasswordEmail,
    data,
    isPending,
    error
  } = trpc.auth.forgotPassword.useMutation();

  const form = useForm({
    defaultValues: {
      email: '',
    }
  });

  const onSubmit = async (values: RouterInput['auth']['forgotPassword']) => {
    await sendForgotPasswordEmail(values);

    form.reset();
  };

  return (
    <Container maxW="container.sm" p={[0]}>
      <Card>
        <Center pb={4}>
          <Heading>Forgot Password</Heading>
        </Center>
        {error && <Error>{error.message}</Error>}
        {data && (
          <Success>
            <Text>If an account with the email <Code>{data}</Code> exists, you will see an email in your inbox with a link to reset your password.</Text>
          </Success>
        )}
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormControl>
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              required
              {...form.register('email', {
                required: 'This is required',
              })}
              placeholder="example@ridebeep.app"
            />
            <FormHelperText>We'll send you an email with a link to reset your password.</FormHelperText>
            <FormErrorMessage>{form.formState.errors.email?.message}</FormErrorMessage>
          </FormControl>
          <Button
            w="full"
            mt={4}
            type="submit"
            isLoading={isPending}
          >
            Send Reset Password Email
          </Button>
        </form>
      </Card>
    </Container>
  );
}
