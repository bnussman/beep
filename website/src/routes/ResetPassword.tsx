import React from 'react';
import { Error } from '../components/Error';
import { Success } from '../components/Success';
import { Button, Center, Container, FormControl, FormErrorMessage, FormLabel, Heading, Input } from '@chakra-ui/react';
import { Card } from '../components/Card';
import { useForm } from 'react-hook-form';
import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../utils/root';
import { RouterInput, trpc } from '../utils/trpc';

type ResetPasswordValues = RouterInput['auth']['resetPassword'];

export const resetPasswordRoute = createRoute({
  component: ResetPassword,
  path: "/password/reset/$id",
  getParentRoute: () => rootRoute,
});

export function ResetPassword() {
  const { id } = resetPasswordRoute.useParams();

  const {
    mutateAsync: resetPassword,
    data,
    error,
    isPending
  } = trpc.auth.resetPassword.useMutation();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isValid },
  } = useForm<ResetPasswordValues>({ mode: 'onChange' });

  const validationErrors = error?.data?.zodError?.fieldErrors;

  const onSubmit = handleSubmit(async (variables) => {
    await resetPassword({
      password: variables.password,
      id,
    });

    reset();
  });

  return (
    <Container maxW="container.sm" p={[0]}>
      <Card>
        <Center pb={8}>
          <Heading>Reset Password</Heading>
        </Center>
        {error && !validationErrors && <Error>{error.message}</Error>}
        {data && <Success message="Successfully changed password" />}
        <form onSubmit={onSubmit}>
          <FormControl isInvalid={Boolean(errors.password) || Boolean(validationErrors?.password)}>
            <FormLabel>New Password</FormLabel>
            <Input
              type="password"
              {...register('password', {
                required: 'This is required',
              })}
            />
            <FormErrorMessage>
              {errors.password && errors.password.message}
              {validationErrors?.password && validationErrors?.password[0]}
            </FormErrorMessage>
          </FormControl>
          <Button
            w="full"
            mt={4}
            type="submit"
            isLoading={isPending}
            isDisabled={!isValid}
          >
            Reset Password
          </Button>
        </form>
      </Card>
    </Container>
  );
}
