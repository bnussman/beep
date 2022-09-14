import React, { FormEvent, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { gql, useMutation } from '@apollo/client';
import { LoginMutation } from '../generated/graphql';
import { Error } from '../components/Error';
import { GetUserData } from '../App';
import { client } from '../utils/Apollo';
import { Button, Input, FormControl, FormLabel, Container, HStack, Spacer, Stack, Center, Heading } from "@chakra-ui/react"
import { Card } from '../components/Card';
import { PasswordInput } from '../components/PasswordInput';

const LoginGraphQL = gql`
  mutation Login($username: String!, $password: String!) {
    login(input: { username: $username, password: $password }) {
      tokens {
        id
        tokenid
      }
      user {
        id
        name
        first
        last
        email
        phone
        venmo
        isBeeping
        isEmailVerified
        isStudent
        groupRate
        singlesRate
        photo
        capacity
        username
        role
        cashapp
        queueSize
      }
    }
  }
`;

export function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [login, { loading, error }] = useMutation<LoginMutation>(LoginGraphQL);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();

    const result = await login({
      variables: {
        username: username,
        password: password
      },
    });

    if (result) {
      localStorage.setItem('user', JSON.stringify(result.data?.login));

      client.writeQuery({
        query: GetUserData,
        data: { getUser: { ...result.data?.login.user } }
      });

      navigate('/');
    }
  }

  return (
    <Container maxW="container.sm" p={[0]}>
      <Card>
        <Center pb={8}>
          <Heading>Login</Heading>
        </Center>
        {error && <Error error={error} />}
        <form onSubmit={handleLogin}>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Username or Email</FormLabel>
              <Input
                type="email"
                onChange={(value: any) => setUsername(value.target.value)}
              />
            </FormControl>
            <FormControl mt={2}>
              <FormLabel>Password</FormLabel>
              <PasswordInput onChange={(value: any) => setPassword(value.target.value)} />
            </FormControl>
            <HStack>
              <Button
                type="submit"
                onClick={handleLogin}
                isLoading={loading}
                disabled={!username || !password}
                textColor="white"
                bgGradient='linear(to-r, #fb7ba2, #fce043)'
                boxShadow="0 0 15px 2px #fb7ba2"
                _hover={{
                  bgGradient: 'linear(to-r, pink.200, yellow.200)',
                }}
                _active={{
                  bgGradient: 'linear(to-r, pink.300, yellow.400)',
                }}
              >
                Sign in
              </Button>
              <Spacer />
              <Button as={Link} to="/password/forgot">
                Forgot Password
              </Button>
            </HStack>
          </Stack>
        </form>
      </Card>
    </Container>
  );
}