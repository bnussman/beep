import React from "react";
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../utils/root";
import { trpc } from "../utils/trpc";
import {
  Alert,
  Box,
  Button,
  Card,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";

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
  const form = useForm<Values>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    resolver(values) {
      if (values.password !== values.confirmPassword) {
        return {
          values,
          errors: { confirmPassword: { message: "Password must match." } },
        };
      }
      return { values, errors: {} };
    },
  });

  const {
    mutateAsync: changePassword,
    data,
    error,
  } = trpc.auth.changePassword.useMutation({
    onError(errors) {
      if (errors.data?.zodError?.fieldErrors) {
        for (const field in errors.data?.zodError?.fieldErrors) {
          form.setError(field as keyof Values, {
            message: errors.data?.zodError?.fieldErrors[field]?.[0],
          });
        }
      } else {
        form.setError("root", { message: errors.message });
      }
    },
  });

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
