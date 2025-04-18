import React from "react";
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../utils/root";
import { RouterInput, trpc } from "../utils/trpc";
import { Controller, useForm } from "react-hook-form";
import {
  Card,
  Stack,
  Button,
  TextField,
  Alert,
  Typography,
  Box,
} from "@mui/material";

export const forgotPasswordRoute = createRoute({
  component: ForgotPassword,
  path: "/password/forgot",
  getParentRoute: () => rootRoute,
});

export function ForgotPassword() {
  const form = useForm({
    defaultValues: {
      email: "",
    },
  });

  const {
    mutateAsync: sendForgotPasswordEmail,
    data,
    isPending,
    error,
  } = trpc.auth.forgotPassword.useMutation({
    onError(errors) {
      if (errors.data?.zodError?.fieldErrors) {
        for (const field in errors.data?.zodError?.fieldErrors) {
          form.setError(field as "email", {
            message: errors.data?.zodError?.fieldErrors[field]?.[0],
          });
        }
      } else {
        form.setError("root", { message: errors.message });
      }
    },
  });

  const onSubmit = async (values: RouterInput["auth"]["forgotPassword"]) => {
    await sendForgotPasswordEmail(values);

    form.reset();
  };

  return (
    <Card sx={{ p: 3 }}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
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
              />
            )}
          />
          <Box display="flex" justifyContent="flex-end">
            <Button
              type="submit"
              loading={form.formState.isSubmitting}
              variant="contained"
            >
              Send Reset Password Email
            </Button>
          </Box>
        </Stack>
      </form>
    </Card>
  );
}
