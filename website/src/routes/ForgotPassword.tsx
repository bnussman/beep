import React from "react";
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../utils/root";
import { RouterInput } from "../utils/trpc";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { ORPCError } from "@orpc/client";
import { orpc } from "../utils/orpc";
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
    }),
  );

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
                required
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
