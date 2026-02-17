import React from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { RouterInput, useTRPC } from "../../src/utils/trpc";
import {
  Alert,
  Button,
  Card,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";

import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/login")({
  component: Login,
});

export function Login() {
  const trpc = useTRPC();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<RouterInput["auth"]["login"]>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { mutateAsync: login } = useMutation(
    trpc.auth.login.mutationOptions({
      onError(error) {
        form.setError("root", { message: error.message });
      },
    }),
  );

  const onSubmit = async (values: RouterInput["auth"]["login"]) => {
    const result = await login(values);

    localStorage.setItem("user", JSON.stringify(result));

    queryClient.setQueryData(trpc.user.me.queryKey(), result.user);

    navigate({ to: "/" });
  };

  return (
    <Card sx={{ p: 3 }}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Typography fontWeight="bold" variant="h4">
            Login
          </Typography>
          {form.formState.errors.root?.message && (
            <Alert severity="error">{form.formState.errors.root.message}</Alert>
          )}
          <Controller
            control={form.control}
            name="username"
            render={({ field, fieldState }) => (
              <TextField
                label="Username or Email"
                type="text"
                value={field.value}
                onChange={field.onChange}
                error={Boolean(fieldState.error?.message)}
                helperText={fieldState.error?.message}
                required
              />
            )}
          />
          <Controller
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <TextField
                label="Password"
                type="password"
                value={field.value}
                onChange={field.onChange}
                error={Boolean(fieldState.error?.message)}
                helperText={fieldState.error?.message}
                required
              />
            )}
          />
          <Stack direction="row" justifyContent="space-between">
            <Button LinkComponent={Link} href="/password/forgot">
              Forgot Password
            </Button>
            <Button
              type="submit"
              loading={form.formState.isSubmitting}
              variant="contained"
            >
              Sign in
            </Button>
          </Stack>
        </Stack>
      </form>
    </Card>
  );
}
