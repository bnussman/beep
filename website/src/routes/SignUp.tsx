import React, { FormEvent, useContext, useState } from 'react';
import { UserContext } from '../UserContext';
import { Link as RouterLink, Navigate, useNavigate } from "react-router-dom";
import { gql, useMutation } from '@apollo/client';
import { SignUpMutation } from '../generated/graphql';
import { Error } from '../components/Error';
import { client } from '../utils/Apollo';
import { GetUserData } from '../App';
import { Link, Text, Avatar, Box, Button, Input, FormControl, FormLabel, FormHelperText, Code, Alert, AlertIcon, Flex } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

const SignUpGraphQL = gql`
  mutation SignUp ($first: String!, $last: String!, $email: String!, $phone: String!, $venmo: String, $cashapp: String, $username: String!, $password: String!, $picture: Upload!) {
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
  const user = useContext(UserContext);
  const [first, setFirst] = useState<string>('');
  const [last, setLast] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [venmo, setVenmo] = useState<string>('');
  const [cashapp, setCashapp] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [photo, setPhoto] = useState<File>();
  const [photoError, setPhotoError] = useState<boolean>(false);
  const [signup, { loading, error }] = useMutation<SignUpMutation>(SignUpGraphQL);

  async function handleSignUp(e: FormEvent): Promise<void> {
    e.preventDefault();

    if (!photo) {
      setPhotoError(true)
      return;
    }

    setPhotoError(false);

    try {
      const result = await signup({
        variables: {
          first: first,
          last: last,
          email: email,
          phone: phone,
          venmo: venmo,
          cashapp: cashapp,
          username: username,
          password: password,
          picture: photo
        }
      });

      if (result) {
        localStorage.setItem('user', JSON.stringify(result?.data?.signup));
        client.writeQuery({
          query: GetUserData,
          data: { getUser: { ...result.data?.signup.user } }
        });

        navigate('/');
      }
    }
    catch (error) {

    }
  }

  if (user) {
    return <Navigate to={{ pathname: "/" }} />;
  }

  return (
    <Box>
      {error && <Error error={error} />}
      {photoError && <Error>Please pick a profile photo</Error>}
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
        <FormControl>
          <FormLabel>First Name</FormLabel>
          <Input
            type="text"
            value={first}
            onChange={(value: any) => setFirst(value.target.value)}
          />
        </FormControl>
        <FormControl mt={2}>
          <FormLabel>Last Name</FormLabel>
          <Input
            type="text"
            value={last}
            onChange={(value: any) => setLast(value.target.value)}
          />
        </FormControl>
        <FormControl mt={2}>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(value: any) => setEmail(value.target.value)}
          />
          <FormHelperText>Use your <Code>.edu</Code> to be eligible to use the Beep App</FormHelperText>
        </FormControl>
        <FormControl mt={2}>
          <FormLabel>Phone Number</FormLabel>
          <Input
            type="phone"
            value={phone}
            onChange={(value: any) => setPhone(value.target.value)}
          />
        </FormControl>
        <FormControl mt={2}>
          <FormLabel>Venmo Username</FormLabel>
          <Input
            type="text"
            value={venmo}
            onChange={(value: any) => setVenmo(value.target.value)}
          />
        </FormControl>
        <FormControl mt={2}>
          <FormLabel>CashApp Username</FormLabel>
          <Input
            type="text"
            value={cashapp}
            onChange={(value: any) => setCashapp(value.target.value)}
          />
        </FormControl>
        <FormControl mt={2}>
          <FormLabel>Username</FormLabel>
          <Input
            type="text"
            value={username}
            onChange={(value: any) => setUsername(value.target.value)}
          />
        </FormControl>
        <FormControl mt={2}>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(value: any) => setPassword(value.target.value)}
          />
        </FormControl>
        <Box mt={2} mb={2}>
          <Flex align="center">
            {photo &&
              <Avatar mr={4} src={URL.createObjectURL(photo)} />
            }
            <input
              hidden
              id="photo"
              type="file"
              onChange={(e) => {
                setPhoto(e.target.files?.[0]);
              }}
            />
            <Box>
              <Button leftIcon={<AddIcon />}>
                <label
                  htmlFor="photo"
                >
                  Choose Profile Photo
                </label>
              </Button>
            </Box>
          </Flex>
        </Box>
        <Button
          type="submit"
          isLoading={loading}
        >
          Sign Up
        </Button>
      </form>
    </Box>
  );
}

export default SignUp;
