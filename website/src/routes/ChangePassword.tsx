import React, { useState } from 'react';
import { Error } from '../components/Error';
import { gql, useMutation } from '@apollo/client';
import { ChangePasswordMutation } from '../generated/graphql';
import { Success } from '../components/Success';
import { Input, Button, FormControl, FormLabel, Center, Heading, Container, Flex, Stack } from '@chakra-ui/react';
import { Card } from '../components/Card';

const ChangePasswordGraphQL = gql`
  mutation ChangePassword($password: String!) {
    changePassword (input: {password: $password})
  }
`;

export function ChangePassword() {
  const [changePassword, { data, loading, error }] = useMutation<ChangePasswordMutation>(ChangePasswordGraphQL);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleEdit(e: any): Promise<void> {
    e.preventDefault();

    changePassword({
      variables: {
        password: password
      }
    })
      .then(() => {
        setPassword('');
        setConfirmPassword('');
      });
  }

  return (
    <Container maxW="container.sm" p={[0]}>
      <Card>
        <Center pb={4}>
          <Heading>Change Password</Heading>
        </Center>
        {data?.changePassword && <Success message="Successfully changed your password" />}
        {error && <Error error={error} />}
        <form onSubmit={handleEdit}>
          <Stack>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(value: any) => setPassword(value.target.value)}
              />
            </FormControl>
            <FormControl id="password2" mt={2} mb={2}>
              <FormLabel>Repreat Password</FormLabel>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(value: any) => setConfirmPassword(value.target.value)}
              />
            </FormControl>
            <Flex justifyContent="flex-end">
              <Button
                isLoading={loading}
                type="submit"
                colorScheme="blue"
                isDisabled={!password || password !== confirmPassword}
              >
                Update password
              </Button>
            </Flex>
          </Stack>
        </form>
      </Card>
    </Container>
  );
}
