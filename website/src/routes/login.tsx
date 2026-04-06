import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { RouterInput, useTRPC } from "../utils/trpc";
import {
  Alert,
  Button,
  Card,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const trpc = useTRPC();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<RouterInput["auth"]["login"]>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { mutate: login } = useMutation(
    trpc.auth.login.mutationOptions({
      onError(error) {
        form.setError("root", { message: error.message });
      },
      onSuccess(data) {
        localStorage.setItem("user", JSON.stringify(data));

        queryClient.setQueryData(trpc.user.me.queryKey(), data.user);

        navigate({ to: "/" });
      },
    }),
  );

  return (
    <Container maxWidth="sm">
      <Card sx={{ p: 3 }}>
        <form onSubmit={form.handleSubmit((values) => login(values))}>
          <Stack spacing={2}>
            <Typography fontWeight="bold" variant="h4">
              Login
            </Typography>
            {form.formState.errors.root?.message && (
              <Alert severity="error">
                {form.formState.errors.root.message}
              </Alert>
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
    </Container>
  );
}
