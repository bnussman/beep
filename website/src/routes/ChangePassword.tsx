import React from "react";
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../utils/root";
import { useTRPC } from "../utils/trpc";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import {
  Alert,
  Box,
  Button,
  Card,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export const changePasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/password/change",
  component: ChangePassword,
});

interface Values {
  password: string;
  confirmPassword: string;
}

export function ChangePassword() {
  const trpc = useTRPC();
  const form = useForm<Values>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    resolver(values) {
      if (values.password !== values.confirmPassword) {
        return {
          values: {} as Record<string, never>,
          errors: {
            confirmPassword: {
              message: "Password must match.",
              type: "validate",
            },
          },
        };
      }
      return { values, errors: {} as Record<string, never> };
    },
  });

  const { mutateAsync: changePassword, data } = useMutation(
    trpc.auth.changePassword.mutationOptions({
      onError(error) {
        if (error.data?.fieldErrors) {
          for (const field in error.data?.fieldErrors) {
            form.setError(field as keyof Values, {
              message: error.data?.fieldErrors[field]?.[0],
            });
          }
        } else {
          form.setError("root", { message: error.message });
        }
      },
    }),
  );

  const onSubmit = async (values: Values) => {
    await changePassword(values);
    form.reset();
  };

  return (
    <Card sx={{ p: 3 }}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Typography variant="h4" fontWeight="bold">
            Change Password
          </Typography>
          {data && (
            <Alert severity="success">Successfully changed your password</Alert>
          )}
          {form.formState.errors.root?.message && (
            <Alert severity="error">{form.formState.errors.root.message}</Alert>
          )}
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <TextField
                label="Password"
                type="new-password"
                value={field.value}
                onChange={field.onChange}
                error={Boolean(fieldState.error?.message)}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="confirmPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <TextField
                label="Confirm Password"
                type="new-password"
                value={field.value}
                onChange={field.onChange}
                error={Boolean(fieldState.error?.message)}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Box display="flex" justifyContent="flex-end">
            <Button
              loading={form.formState.isSubmitting}
              type="submit"
              variant="contained"
            >
              Update password
            </Button>
          </Box>
        </Stack>
      </form>
    </Card>
  );
}
