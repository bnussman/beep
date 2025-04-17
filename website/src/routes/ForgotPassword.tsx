import React from "react";
import {
  Text,
  Button,
  Center,
  Code,
  Container,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Box,
} from "@chakra-ui/react";
import { Card } from "../components/Card";
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../utils/root";
import { RouterInput, trpc } from "../utils/trpc";
import { useForm } from "react-hook-form";
import { Alert } from "@mui/material";

export const forgotPasswordRoute = createRoute({
  component: ForgotPassword,
  path: "/password/forgot",
  getParentRoute: () => rootRoute,
});

export function ForgotPassword() {
  const {
    mutateAsync: sendForgotPasswordEmail,
    data,
    isPending,
    error,
  } = trpc.auth.forgotPassword.useMutation();

  const form = useForm({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: RouterInput["auth"]["forgotPassword"]) => {
    await sendForgotPasswordEmail(values);

    form.reset();
  };

  return (
    <Container maxW="container.sm" p={[0]}>
      <Card>
        <Center pb={4}>
          <Heading>Forgot Password</Heading>
        </Center>
        {error && <Alert severity="error">{error.message}</Alert>}
        {data && (
          <Alert severity="success">
            Done! If an account with the email <Code>{data}</Code> exists, you
            will recieve an email with a link to reset your password.
          </Alert>
        )}
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormControl>
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              required
              {...form.register("email", {
                required: "This is required",
              })}
            />
            <FormHelperText>
              We'll send you an email with a link to reset your password.
            </FormHelperText>
            <FormErrorMessage>
              {form.formState.errors.email?.message}
            </FormErrorMessage>
          </FormControl>
          <Box display="flex" justifyContent="flex-end">
            <Button
              mt={4}
              type="submit"
              isLoading={isPending}
              colorScheme="blue"
            >
              Send Reset Password Email
            </Button>
          </Box>
        </form>
      </Card>
    </Container>
  );
}
