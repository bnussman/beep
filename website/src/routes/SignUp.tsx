import React, { useMemo } from 'react';
import { useMutation } from '@apollo/client';
import { Error } from '../components/Error';
import { client } from '../utils/Apollo';
import { GetUserData, rootRoute } from '../App';
import { Card } from '../components/Card';
import { useValidationErrors } from '../utils/useValidationErrors';
import { useForm } from "react-hook-form";
import { PasswordInput } from '../components/PasswordInput';
import {
  Link as ChakraLink,
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
  Heading,
  FormErrorMessage,
  useBreakpointValue
} from '@chakra-ui/react';
import { Link, Route, useNavigate } from '@tanstack/react-router';
import { VariablesOf, graphql } from 'gql.tada';

const SignUpGraphQL = graphql(`
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
        photo
        capacity
        username
        role
        cashapp
        queueSize
      }
    }
  }
`);

type Values = VariablesOf<typeof SignUpGraphQL>;

export const signupRoute = new Route({
  component: SignUp,
  path: "/signup",
  getParentRoute: () => rootRoute,
});


export function SignUp() {
  const navigate = useNavigate();
  const avatarSize = useBreakpointValue({ base: 'xl', md: '2xl' });

  const [signup, { error, loading }] = useMutation(SignUpGraphQL, {
    context: {
      headers: {
        'apollo-require-preflight': true,
      },
    },
  });

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<Values>({ mode: "onChange" });

  const picture = watch("picture");

  const validationErrors = useValidationErrors<Values>(error);

  const onSubmit = handleSubmit(async (variables) => {
    const { data } = await signup({
      variables: { ...variables, picture: variables.picture[0] }
    });

    if (data) {
      localStorage.setItem('user', JSON.stringify(data?.signup));

      client.writeQuery({
        query: GetUserData,
        data: { getUser: { ...data?.signup?.user } }
      });

      navigate({ to: '/' });
    }
  });

  const Image = useMemo(() => (
    <Avatar size={avatarSize} src={picture?.[0] ? URL.createObjectURL(picture?.[0]) : undefined} cursor="pointer" />
  ), [picture, avatarSize]);

  return (
    <Container maxW="container.sm" p={[0]}>
      <Card>
        <Center pb={8}>
          <Heading>Sign Up</Heading>
        </Center>
        {error && !validationErrors ? <Error error={error} /> : null}
        <Alert mb={4} status="info">
          <AlertIcon />
          <Text>
            By signing up, you agree to our{' '}
            <ChakraLink as={Link} to="/terms">Terms of Service</ChakraLink>
            {' '}and{' '}
            <ChakraLink as={Link} to="/privacy">Privacy Policy</ChakraLink>
          </Text>
        </Alert>
        <form onSubmit={onSubmit}>
          <Stack>
            <HStack>
              <Stack w="full">
                <FormControl isInvalid={Boolean(errors.first) || Boolean(validationErrors?.first)}>
                  <FormLabel>First Name</FormLabel>
                  <Input
                    type="text"
                    id="first"
                    {...register('first', {
                      required: 'This is required',
                    })}
                  />
                  <FormErrorMessage>
                    {errors.first && errors.first.message}
                    {validationErrors?.first && validationErrors?.first[0]}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={Boolean(errors.last) || Boolean(validationErrors?.last)}>
                  <FormLabel>Last Name</FormLabel>
                  <Input
                    type="text"
                    id="last"
                    {...register('last', {
                      required: 'This is required',
                    })}
                  />
                  <FormErrorMessage>
                    {errors.last && errors.last.message}
                    {validationErrors?.last && validationErrors?.last[0]}
                  </FormErrorMessage>
                </FormControl>
              </Stack>
              <Spacer />
              <Box>
                <FormControl isInvalid={Boolean(errors.picture) || Boolean(validationErrors?.picture)}>
                  <FormLabel htmlFor="picture">
                    {Image}
                  </FormLabel>
                  <Input
                    hidden
                    variant="unstyled"
                    id="picture"
                    type="file"
                    {...register('picture', {
                      required: 'This is required',
                    })}
                  />
                  <FormErrorMessage>
                    {errors.picture && errors.picture.message as unknown as string}
                    {validationErrors?.picture && validationErrors?.picture[0]}
                  </FormErrorMessage>
                </FormControl>
              </Box>
            </HStack>
            <FormControl isInvalid={Boolean(Boolean(errors.email) || validationErrors?.email)}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                id="email"
                {...register('email', {
                  required: 'This is required',
                })}
              />
              <FormHelperText>You must use a <Code>.edu</Code> to be eligible to use the Beep App</FormHelperText>
              <FormErrorMessage>
                {errors.email && errors.email.message}
                {validationErrors?.email && validationErrors?.email[0]}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={Boolean(errors.phone) || Boolean(validationErrors?.phone)}>
              <FormLabel>Phone Number</FormLabel>
              <Input
                type="phone"
                id="phone"
                {...register('phone', {
                  required: 'This is required',
                })}
              />
              <FormErrorMessage>
                {errors.phone && errors.phone.message}
                {validationErrors?.phone && validationErrors?.phone[0]}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={Boolean(errors.venmo) || Boolean(validationErrors?.venmo)}>
              <FormLabel>Venmo Username</FormLabel>
              <Input
                type="text"
                id="venmo"
                {...register('venmo')}
              />
              <FormErrorMessage>
                {errors.venmo && errors.venmo.message}
                {validationErrors?.venmo && validationErrors?.venmo[0]}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={Boolean(errors.username) || Boolean(validationErrors?.username)}>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                id="username"
                {...register('username', {
                  required: 'This is required',
                })}
              />
              <FormErrorMessage>
                {errors.username && errors.username.message}
                {validationErrors?.username && validationErrors?.username[0]}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={Boolean(errors.password) || Boolean(validationErrors?.password)}>
              <FormLabel>Password</FormLabel>
              <PasswordInput
                id="password"
                {...register('password', {
                  required: 'This is required',
                })}
              />
              <FormErrorMessage>
                {errors.password && errors.password.message}
                {validationErrors?.password && validationErrors?.password[0]}
              </FormErrorMessage>
            </FormControl>
            <Button type="submit" isLoading={loading}>
              Sign Up
            </Button>
          </Stack>
        </form>
      </Card>
    </Container>
  );
}
