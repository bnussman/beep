import React from 'react';
import { useMutation } from '@apollo/client';
import { Error } from '../components/Error';
import { Success } from '../components/Success';
import { Button, Center, Container, FormControl, FormErrorMessage, FormLabel, Heading, Input } from '@chakra-ui/react';
import { Card } from '../components/Card';
import { useValidationErrors } from '../utils/useValidationErrors';
import { useForm } from 'react-hook-form';
import { rootRoute } from '../App';
import { Route } from '@tanstack/react-router';
import { VariablesOf, graphql } from 'gql.tada';

const Reset = graphql(`
  mutation ResetPassword($id: String!, $password: String!) {
    resetPassword(
      id: $id,
      input: {
        password: $password
      }
    )
  }
`);

type ResetPasswordValues = VariablesOf<typeof Reset>;

export const resetPasswordRoute = new Route({
  component: ResetPassword,
  path: "/password/reset/$id",
  getParentRoute: () => rootRoute,
});


export function ResetPassword() {
  const { id } = resetPasswordRoute.useParams();
  const [resetPassword, { data, error, loading }] = useMutation(Reset);

  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm<ResetPasswordValues>({ mode: 'onChange' });

  const validationErrors = useValidationErrors<ResetPasswordValues>(error);

  const onSubmit = handleSubmit(async (variables) => {
    await resetPassword({ variables: { ...variables, id } });
  });

  return (
    <Container maxW="container.sm" p={[0]}>
      <Card>
        <Center pb={8}>
          <Heading>Reset Password</Heading>
        </Center>
        {error && !validationErrors && <Error error={error} />}
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
            isLoading={loading}
            isDisabled={!isValid}
          >
            Reset Password
          </Button>
        </form>
      </Card>
    </Container>
  );
}
