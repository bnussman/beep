import React, { useState } from 'react';
import { Error } from '../components/Error';
import { useMutation } from '@apollo/client';
import { Success } from '../components/Success';
import { Input, Button, FormControl, FormLabel, Center, Heading, Container, Flex, Stack } from '@chakra-ui/react';
import { Card } from '../components/Card';
import { Route } from '@tanstack/react-router';
import { rootRoute } from '../App';
import { graphql } from 'gql.tada';

const ChangePasswordGraphQL = graphql(`
  mutation ChangePassword($password: String!) {
    changePassword (input: {password: $password})
  }
`);

export const changePasswordRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/password/change',
  component: ChangePassword,
})

export function ChangePassword() {
  const [changePassword, { data, loading, error }] = useMutation(ChangePasswordGraphQL);
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
