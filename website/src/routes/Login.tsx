import React from "react";
import { Link, createRoute, useNavigate } from "@tanstack/react-router";
import { rootRoute } from "../utils/root";
import { RouterInput, trpc } from "../utils/trpc";
import {
  Alert,
  Button,
  Card,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";

export const loginRoute = createRoute({
  component: Login,
  path: "/login",
  getParentRoute: () => rootRoute,
});

export function Login() {
  const navigate = useNavigate();
  const utils = trpc.useUtils();

  const form = useForm<RouterInput["auth"]["login"]>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { mutateAsync: login } = trpc.auth.login.useMutation({
    onError(error) {
      form.setError("root", { message: error.message });
    },
  });

  const onSubmit = async (values: RouterInput["auth"]["login"]) => {
    const result = await login(values);

    localStorage.setItem("user", JSON.stringify(result));

    utils.user.me.setData(undefined, result.user);

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
