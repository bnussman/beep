import React, { useState } from 'react';
import { Error } from '../components/Error';
import { Success } from '../components/Success';
import { Input, Button, FormControl, FormLabel, Center, Heading, Container, Flex, Stack } from '@chakra-ui/react';
import { Card } from '../components/Card';
import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../utils/root';
import { trpc } from '../utils/trpc';

export const changePasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/password/change',
  component: ChangePassword,
})

export function ChangePassword() {
  const {
    mutateAsync: changePassword,
    data,
    isPending,
    error
  } = trpc.auth.changePassword.useMutation();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleEdit(e: any): Promise<void> {
    e.preventDefault();

    changePassword({ password })
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
        {data && <Success message="Successfully changed your password" />}
        {error && <Error>{error.message}</Error>}
        <form onSubmit={handleEdit}>
          <Stack>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(value) => setPassword(value.target.value)}
              />
            </FormControl>
            <FormControl id="password2" mt={2} mb={2}>
              <FormLabel>Repreat Password</FormLabel>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(value) => setConfirmPassword(value.target.value)}
              />
            </FormControl>
            <Flex justifyContent="flex-end">
              <Button
                isLoading={isPending}
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
