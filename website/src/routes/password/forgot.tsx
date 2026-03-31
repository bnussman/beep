import React from "react";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useTRPC } from "../../utils/trpc";
import { Controller, useForm } from "react-hook-form";
import {
  Card,
  Stack,
  Button,
  TextField,
  Alert,
  Typography,
  Box,
  Container,
} from "@mui/material";

export const Route = createFileRoute("/password/forgot")({
  component: ForgotPassword,
});

function ForgotPassword() {
  const trpc = useTRPC();
  const form = useForm({
    defaultValues: {
      email: "",
    },
  });

  const {
    mutate: sendForgotPasswordEmail,
    data,
    isPending,
  } = useMutation(
    trpc.auth.forgotPassword.mutationOptions({
      onError(error) {
        if (error.data?.fieldErrors) {
          for (const field in error.data?.fieldErrors) {
            form.setError(field as "email", {
              message: error.data?.fieldErrors[field]?.[0],
            });
          }
        } else {
          form.setError("root", { message: error.message });
        }
      },
      onSuccess() {
        form.reset();
      },
    }),
  );

  return (
    <Container maxWidth="sm">
      <Card sx={{ p: 3 }}>
        <form
          onSubmit={form.handleSubmit((values) =>
            sendForgotPasswordEmail(values),
          )}
        >
          <Stack spacing={2}>
            <Typography variant="h4" fontWeight="bold">
              Forgot Password
            </Typography>
            {form.formState.errors.root?.message && (
              <Alert severity="error">
                {form.formState.errors.root?.message}
              </Alert>
            )}
            {data && (
              <Alert severity="success">
                Done! If an account with the email "{data}" exists, you will
                recieve an email with a link to reset your password.
              </Alert>
            )}
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <TextField
                  label="Email"
                  type="email"
                  value={field.value}
                  onChange={field.onChange}
                  error={Boolean(fieldState.error?.message)}
                  helperText={
                    fieldState.error?.message ??
                    "We'll send you an email with a link to reset your password."
                  }
                  disabled={!!data}
                  required
                />
              )}
            />
            <Box display="flex" justifyContent="flex-end">
              <Button
                type="submit"
                loading={isPending}
                disabled={!!data}
                variant="contained"
              >
                Send Reset Password Email
              </Button>
            </Box>
          </Stack>
        </form>
      </Card>
    </Container>
  );
}
