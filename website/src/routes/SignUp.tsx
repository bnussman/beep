import React, { useMemo } from "react";
import { trpc } from "../utils/trpc";
import { Error } from "../components/Error";
import { Card } from "../components/Card";
import { useForm } from "react-hook-form";
import { PasswordInput } from "../components/PasswordInput";
import { Link, createRoute, useNavigate } from "@tanstack/react-router";
import { rootRoute } from "../utils/root";
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
  Container,
  HStack,
  Stack,
  Spacer,
  Center,
  Heading,
  FormErrorMessage,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Alert } from "@mui/material";

export const signupRoute = createRoute({
  component: SignUp,
  path: "/signup",
  getParentRoute: () => rootRoute,
});

interface SignUpFormValues {
  first: string;
  last: string;
  username: string;
  password: string;
  email: string;
  venmo: string;
  phone: string;
  photo: FileList;
}

export function SignUp() {
  const navigate = useNavigate();
  const avatarSize = useBreakpointValue({ base: "xl", md: "2xl" });

  const {
    mutateAsync: signup,
    error,
    isPending,
  } = trpc.auth.signup.useMutation();

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm<SignUpFormValues>({ mode: "onChange" });

  const utils = trpc.useUtils();

  const photo = watch("photo");

  const validationErrors = error?.data?.zodError?.fieldErrors;

  const onSubmit = handleSubmit(async (variables, e) => {
    const formData = new FormData();
    for (const key in variables) {
      if (key === "photo") {
        formData.set(
          key,
          (variables[key as keyof typeof variables] as FileList)[0],
        );
      } else {
        formData.set(key, variables[key as keyof typeof variables] as string);
      }
    }

    const data = await signup(formData);

    if (data) {
      localStorage.setItem("user", JSON.stringify(data));

      utils.user.me.setData(undefined, data.user);

      navigate({ to: "/" });
    }
  });

  const Image = useMemo(
    () => (
      <Avatar
        size={avatarSize}
        src={photo?.[0] ? URL.createObjectURL(photo?.[0]) : undefined}
        cursor="pointer"
      />
    ),
    [photo, avatarSize],
  );

  return (
    <Container maxW="container.sm" p={[0]}>
      <Card>
        <Center pb={8}>
          <Heading>Sign Up</Heading>
        </Center>
        {error && !validationErrors && <Error>{error.message}</Error>}
        <Alert severity="info">
          By signing up, you agree to our{" "}
          <ChakraLink as={Link} preload="intent" to="/terms">
            Terms of Service
          </ChakraLink>{" "}
          and{" "}
          <ChakraLink as={Link} to="/privacy">
            Privacy Policy
          </ChakraLink>
        </Alert>
        <form onSubmit={onSubmit}>
          <Stack>
            <HStack>
              <Stack w="full">
                <FormControl
                  isInvalid={
                    Boolean(errors.first) || Boolean(validationErrors?.first)
                  }
                >
                  <FormLabel>First Name</FormLabel>
                  <Input
                    type="text"
                    id="first"
                    {...register("first", {
                      required: "This is required",
                    })}
                  />
                  <FormErrorMessage>
                    {errors.first && errors.first.message}
                    {validationErrors?.first && validationErrors?.first[0]}
                  </FormErrorMessage>
                </FormControl>
                <FormControl
                  isInvalid={
                    Boolean(errors.last) || Boolean(validationErrors?.last)
                  }
                >
                  <FormLabel>Last Name</FormLabel>
                  <Input
                    type="text"
                    id="last"
                    {...register("last", {
                      required: "This is required",
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
                <FormControl
                  isInvalid={
                    Boolean(errors.photo) || Boolean(validationErrors?.photo)
                  }
                >
                  <FormLabel htmlFor="photo">{Image}</FormLabel>
                  <Input
                    hidden
                    variant="unstyled"
                    id="photo"
                    type="file"
                    {...register("photo", {
                      required: "This is required",
                    })}
                  />
                  <FormErrorMessage>
                    {errors.photo &&
                      (errors.photo.message as unknown as string)}
                    {validationErrors?.photo && validationErrors?.photo[0]}
                  </FormErrorMessage>
                </FormControl>
              </Box>
            </HStack>
            <FormControl
              isInvalid={Boolean(
                Boolean(errors.email) || validationErrors?.email,
              )}
            >
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                id="email"
                {...register("email", {
                  required: "This is required",
                })}
              />
              <FormHelperText>
                You must use a <Code>.edu</Code> to be eligible to use the Beep
                App
              </FormHelperText>
              <FormErrorMessage>
                {errors.email && errors.email.message}
                {validationErrors?.email && validationErrors?.email[0]}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={
                Boolean(errors.phone) || Boolean(validationErrors?.phone)
              }
            >
              <FormLabel>Phone Number</FormLabel>
              <Input
                type="phone"
                id="phone"
                {...register("phone", {
                  required: "This is required",
                })}
              />
              <FormErrorMessage>
                {errors.phone && errors.phone.message}
                {validationErrors?.phone && validationErrors?.phone[0]}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={
                Boolean(errors.venmo) || Boolean(validationErrors?.venmo)
              }
            >
              <FormLabel>Venmo Username</FormLabel>
              <Input type="text" id="venmo" {...register("venmo")} />
              <FormErrorMessage>
                {errors.venmo && errors.venmo.message}
                {validationErrors?.venmo && validationErrors?.venmo[0]}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={
                Boolean(errors.username) || Boolean(validationErrors?.username)
              }
            >
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                id="username"
                {...register("username", {
                  required: "This is required",
                })}
              />
              <FormErrorMessage>
                {errors.username && errors.username.message}
                {validationErrors?.username && validationErrors?.username[0]}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={
                Boolean(errors.password) || Boolean(validationErrors?.password)
              }
            >
              <FormLabel>Password</FormLabel>
              <PasswordInput
                id="password"
                {...register("password", {
                  required: "This is required",
                })}
              />
              <FormErrorMessage>
                {errors.password && errors.password.message}
                {validationErrors?.password && validationErrors?.password[0]}
              </FormErrorMessage>
            </FormControl>
            <Button type="submit" isLoading={isPending}>
              Sign Up
            </Button>
          </Stack>
        </form>
      </Card>
    </Container>
  );
}
