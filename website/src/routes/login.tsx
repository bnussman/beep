import React, { useState } from "react";
import { RouterInputs } from "../../../api/src";
import { Controller, useForm } from "react-hook-form";
import { orpc } from "../utils/orpc";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Alert, Button, FieldError, Input, InputGroup, Label, TextField, Typography } from "@heroui/react";
import { Link } from "../components/Link";
import { EyeIcon, EyeSlashIcon } from "@phosphor-icons/react";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isVisible, setIsVisible] = useState(false);

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
    <div className="flex grow items-center justify-center">
      <form className="flex flex-col gap-5 grow max-w-md" onSubmit={form.handleSubmit((values) => login(values))}>
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
            <TextField {...field} isRequired isInvalid={fieldState.error ? true : undefined}>
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
            <TextField {...field} isRequired isInvalid={fieldState.error ? true : undefined}>
              <Label>Password</Label>
              <InputGroup>
                <InputGroup.Input type={isVisible ? "text" : "password"} />
                <InputGroup.Suffix className="pe-0">
                  <Button
                    isIconOnly
                    aria-label={isVisible ? "Hide password" : "Show password"}
                    size="sm"
                    variant="ghost"
                    onPress={() => setIsVisible(!isVisible)}
                  >
                    {isVisible ? <EyeIcon className="size-4" /> : <EyeSlashIcon className="size-4" />}
                  </Button>
                </InputGroup.Suffix>
              </InputGroup>
              <FieldError>{fieldState.error?.message}</FieldError>
            </TextField>
          )}
        />
        <div className="flex items-center justify-between gap-4">
          <Link to="/password/forgot" className="text-sm">
            Forgot Password
          </Link>
          <Button type="submit" isPending={form.formState.isSubmitting}>
            Sign in
          </Button>
        </div>
      </form>
    </div>
  );
}
