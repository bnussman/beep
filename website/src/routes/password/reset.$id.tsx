import React from "react";
import { orpc } from "../../utils/orpc";
import { ORPCError } from "@orpc/client";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { createFileRoute } from "@tanstack/react-router";
import {
  Typography,
  Alert,
  Card,
  TextField,
  Button,
  Stack,
} from "@mui/material";

export const Route = createFileRoute('/password/reset/$id')({
  component: ResetPassword,
});

interface Values {
  password: string;
}

function ResetPassword() {
  const { id } = Route.useParams();

  const {
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ mode: "onChange" });

  const { mutateAsync: resetPassword, data } =
    useMutation(orpc.auth.resetPassword.mutationOptions({
      onError(error) {
        if (error instanceof ORPCError && error.data?.issues) {
          for (const issue of error.data?.issues) {
            setError(issue.path[0], {
              message: issue.message,
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
