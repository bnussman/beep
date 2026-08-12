import React from "react";
import { ORPCError } from "@orpc/client";
import { orpc } from "../../utils/orpc";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
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
    orpc.auth.forgotPassword.mutationOptions({
      onError(error) {
        if (error instanceof ORPCError && error.data?.issues) {
          for (const issue of error.data?.issues) {
            form.setError(issue.path[0], {
              message: issue.message,
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
