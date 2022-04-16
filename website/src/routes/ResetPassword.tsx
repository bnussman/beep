import { gql, useMutation } from '@apollo/client';
import React, { FormEvent, useState } from 'react';
import { ResetPasswordMutation } from '../generated/graphql';
import { Error } from '../components/Error';
import { Success } from '../components/Success';
import { Box, Button, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

const Reset = gql`
  mutation ResetPassword($id: String!, $password: String!) {
    resetPassword(input: {
      id: $id,
      password: $password
    })
  }
`;

export function ResetPassword() {
  const { id } = useParams();
  const [password, setPassword] = useState<string>("");
  const [reset, { data, loading, error }] = useMutation<ResetPasswordMutation>(Reset);

  async function handleResetPassword(e: FormEvent): Promise<void> {
    e.preventDefault();
    try {
      await reset({ variables: { id: id, password: password } });
    }
    catch (error) {
      //...
    }
  }

  return (
    <Box>
      {error && <Error error={error} />}
      {data && <Success message="Successfully changed password" />}
      <form onSubmit={handleResetPassword}>
        <FormControl>
          <FormLabel>New Password</FormLabel>
          <Input
            type="password"
            onChange={(value: any) => setPassword(value.target.value)}
            disabled={data?.resetPassword}
          />
        </FormControl>
        <Button
          mt={4}
          type="submit"
          isLoading={loading}
          disabled={data?.resetPassword}
        >
          Reset Password
        </Button>
      </form>
    </Box>
  );
}