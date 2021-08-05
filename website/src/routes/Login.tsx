import React from 'react';
import { FormEvent, useContext, useState } from 'react';
import { UserContext } from '../UserContext';
import { Redirect, Link, useHistory } from "react-router-dom";
import { gql, useMutation } from '@apollo/client';
import { LoginMutation } from '../generated/graphql';
import { Error } from '../components/Error';
import { GetUserData } from '../App';
import { client } from '../utils/Apollo';
import { Box, Button, Input, FormControl, FormLabel } from "@chakra-ui/react"

const LoginGraphQL = gql`
  mutation Login($username: String!, $password: String!) {
    login(input: {username: $username, password: $password}) {
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
        photoUrl
        capacity
        masksRequired
        username
        role
        cashapp
        queueSize
      }
    }
  }
`;

function Login() {
  const history = useHistory();
  const user = useContext(UserContext);
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

      history.push('/')
    }
  }

  if (user) {
    return <Redirect to={{ pathname: "/" }} />;
  }

  return (
    <Box>
      {error && <Error error={error} />}
      <form onSubmit={handleLogin}>
        <FormControl>
          <FormLabel>Username</FormLabel>
          <Input
            type="email"
            onChange={(value: any) => setUsername(value.target.value)}
          />
        </FormControl>
        <FormControl mt={2}>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            onChange={(value: any) => setPassword(value.target.value)}
          />
        </FormControl>
        <Box mt={4}>
          <Button
            type="submit"
            onClick={handleLogin}
            isLoading={loading}
            disabled={!username || !password}
          >
            Sign in
        </Button>
        </Box>
      </form>
      <Box mt={8}>
        <Button as={Link} to="password/forgot" variant="link">
          Forgot Password
          </Button>
      </Box>
    </Box>
  );
}

export default Login;
