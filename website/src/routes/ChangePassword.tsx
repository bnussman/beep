import React from "react";
import { orpc } from "../utils/orpc";
import { ORPCError } from "@orpc/client";
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../utils/root";
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
    orpc.auth.changePassword.mutationOptions({
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
