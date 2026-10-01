import React from "react";
import { RouterInputs } from "../../../api/src";
import { Controller, useForm } from "react-hook-form";
import { orpc } from "../utils/orpc";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Alert, Button, FieldError, Input, Label, TextField, Typography } from "@heroui/react";
import { LinkButton } from "../components/LinkButton";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<RouterInputs["auth"]["login"]>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { mutate: login } = useMutation(
    orpc.auth.login.mutationOptions({
      onError(error) {
        form.setError("root", { message: error.message });
      },
      onSuccess(data) {
        localStorage.setItem("user", JSON.stringify(data));

        queryClient.setQueryData(orpc.user.me.queryKey(), data.user);

        navigate({ to: "/" });
      },
    }),
  );

  return (
    <div className="flex flex-grow items-center justify-center">
      <form className="flex flex-col gap-5 flex-grow max-w-md" onSubmit={form.handleSubmit((values) => login(values))}>
        <Typography type="h1">Login</Typography>
        {form.formState.errors.root?.message && (
          <Alert status="danger">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>
                {form.formState.errors.root.message}
              </Alert.Title>
            </Alert.Content>
          </Alert>
        )}
        <Controller
          control={form.control}
          name="username"
          render={({ field, fieldState }) => (
            <TextField {...field} isRequired isInvalid={Boolean(fieldState.error?.message)}>
              <Label>Username or Email</Label>
              <Input type="text" />
              <FieldError>{fieldState.error?.message}</FieldError>
            </TextField>
          )}
        />
        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <TextField {...field} isRequired isInvalid={Boolean(fieldState.error?.message)}>
              <Label>Password</Label>
              <Input type="password" />
              <FieldError>{fieldState.error?.message}</FieldError>
            </TextField>
          )}
        />
        <div className="flex items-center justify-between gap-4">
          <LinkButton to="/password/forgot" variant="ghost">
            Forgot Password
          </LinkButton>
          <Button type="submit" isPending={form.formState.isSubmitting}>
            Sign in
          </Button>
        </div>
      </form>
    </div>
  );
}
