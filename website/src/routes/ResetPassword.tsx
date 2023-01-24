import React from 'react';
import { gql, useMutation } from '@apollo/client';
import { ResetPasswordInput, ResetPasswordMutation } from '../generated/graphql';
import { Error } from '../components/Error';
import { Success } from '../components/Success';
import { Button, Center, Container, FormControl, FormErrorMessage, FormLabel, Heading, Input } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { Card } from '../components/Card';
import { useValidationErrors } from '../utils/useValidationErrors';
import { useForm } from 'react-hook-form';

const Reset = gql`
  mutation ResetPassword($id: String!, $password: String!) {
    resetPassword(
      id: $id,
      input: {
        password: $password
      }
    )
  }
`;

export function ResetPassword() {
  const { id } = useParams();
  const [resetPassword, { data, error }] = useMutation<ResetPasswordMutation>(Reset);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ResetPasswordInput>({ mode: 'onChange' });

  const validationErrors = useValidationErrors<ResetPasswordInput>(error);

  const onSubmit = handleSubmit(async (variables) => {
    await resetPassword({ variables: { id, ...variables} });
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
            isLoading={isSubmitting}
            isDisabled={!isValid}
          >
            Reset Password
          </Button>
        </form>
      </Card>
    </Container>
  );
}
