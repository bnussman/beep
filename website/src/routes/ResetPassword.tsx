import React from "react";
import { Controller, useForm } from "react-hook-form";
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../utils/root";
import { useTRPC } from "../utils/trpc";
import {
  Typography,
  Alert,
  Card,
  TextField,
  Button,
  Stack,
} from "@mui/material";

import { useMutation } from "@tanstack/react-query";

export const resetPasswordRoute = createRoute({
  component: ResetPassword,
  path: "/password/reset/$id",
  getParentRoute: () => rootRoute,
});

interface Values {
  password: string;
}

export function ResetPassword() {
  const trpc = useTRPC();
  const { id } = resetPasswordRoute.useParams();

  const {
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ mode: "onChange" });

  const { mutateAsync: resetPassword, data } =
    useMutation(trpc.auth.resetPassword.mutationOptions({
      onError(error) {
        if (error.data?.fieldErrors) {
          for (const field in error.data?.fieldErrors) {
            setError(field as keyof Values, {
              message: error.data?.fieldErrors[field]?.[0],
            });
          }
        } else {
          setError("root", { message: error.message });
        }
      },
    }));

  const onSubmit = async (values: Values) => {
    await resetPassword({ id, ...values });
    reset();
  };

  return (
    <Card sx={{ p: 3 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Typography variant="h4" fontWeight="bold">
            Reset Password
          </Typography>
          {errors.root?.message && (
            <Alert severity="error">{errors.root.message}</Alert>
          )}
          {data && (
            <Alert severity="success">Successfully changed password</Alert>
          )}
          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                label="Password"
                type="new-password"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                helperText={fieldState.error?.message}
                error={Boolean(fieldState.error?.message)}
              />
            )}
          />
          <Stack direction="row" justifyContent="flex-end">
            <Button type="submit" loading={isSubmitting} variant="contained">
              Reset Password
            </Button>
          </Stack>
        </Stack>
      </form>
    </Card>
  );
}
