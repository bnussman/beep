import React, { FormEvent, useState } from 'react';
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { gql, useMutation } from '@apollo/client';
import { SignUpMutation } from '../generated/graphql';
import { Error } from '../components/Error';
import { client } from '../utils/Apollo';
import { GetUserData } from '../App';
import { Card } from '../components/Card';
import {
  Link,
  Text,
  Avatar,
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
  Code,
  Alert,
  AlertIcon,
  Container,
  HStack,
  Stack,
  Spacer,
  Center,
  Heading
} from '@chakra-ui/react';

const SignUpGraphQL = gql`
  mutation SignUp ($first: String!, $last: String!, $email: String!, $phone: String!, $venmo: String, $cashapp: String, $username: String!, $password: String!, $picture: Upload) {
    signup(
      input: {
        first: $first,
        last: $last,
        email: $email,
        phone: $phone,
        venmo: $venmo,
        cashapp: $cashapp,
        username: $username,
        password: $password,
        picture: $picture
    }) {
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

function SignUp() {
  const navigate = useNavigate();
  const [first, setFirst] = useState<string>('');
  const [last, setLast] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [venmo, setVenmo] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [photo, setPhoto] = useState<File>();
  const [signup, { loading, error }] = useMutation<SignUpMutation>(SignUpGraphQL);

  async function handleSignUp(e: FormEvent): Promise<void> {
    e.preventDefault();

    signup({
      variables: { first, last, email, phone, venmo, username, password, picture: photo }
    })
      .then(({ data }) => {
        localStorage.setItem('user', JSON.stringify(data?.signup));

        client.writeQuery({
          query: GetUserData,
          data: { getUser: { ...data?.signup?.user } }
        });

        navigate('/');
      })
  }

  return (
    <Container maxW="container.sm">
      <Card>
        <Center pb={8}>
          <Heading>Sign Up</Heading>
        </Center>
        {error && <Error error={error} />}
        <Alert mb={4} status="info">
          <AlertIcon />
          <Text>
            By signing up, you agree to our{' '}
            <Link as={RouterLink} to="/terms">Terms of Service</Link>
            {' '}and{' '}
            <Link as={RouterLink} to="/privacy">Privacy Policy</Link>
          </Text>
        </Alert>
        <form onSubmit={handleSignUp}>
          <Stack>
            <HStack>
              <Stack w="full">
                <FormControl>
                  <FormLabel>First Name</FormLabel>
                  <Input
                    type="text"
                    value={first}
                    onChange={(value: any) => setFirst(value.target.value)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Last Name</FormLabel>
                  <Input
                    type="text"
                    value={last}
                    onChange={(value: any) => setLast(value.target.value)}
                  />
                </FormControl>
              </Stack>
              <Spacer />
              <Box>
                <label
                  htmlFor="photo"
                >
                  <Avatar size="2xl" src={photo ? URL.createObjectURL(photo) : undefined} />
                </label>
                <input
                  hidden
                  id="photo"
                  type="file"
                  onChange={(e) => {
                    setPhoto(e.target.files?.[0]);
                  }}
                />
              </Box>
            </HStack>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(value: any) => setEmail(value.target.value)}
              />
              <FormHelperText>You must use a <Code>.edu</Code> to be eligible to use the Beep App</FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>Phone Number</FormLabel>
              <Input
                type="phone"
                value={phone}
                onChange={(value: any) => setPhone(value.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Venmo Username</FormLabel>
              <Input
                type="text"
                value={venmo}
                onChange={(value: any) => setVenmo(value.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                value={username}
                onChange={(value: any) => setUsername(value.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(value: any) => setPassword(value.target.value)}
              />
            </FormControl>
            <Button type="submit" isLoading={loading} >
              Sign Up
            </Button>
          </Stack>
        </form>
      </Card>
    </Container>
  );
}

export default SignUp;
