import React from "react";
import { ORPCError } from "@orpc/client";
import { orpc } from "../../utils/orpc";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import { Alert, Button, Description, FieldError, Input, Label, TextField, Typography } from "@heroui/react";

export const Route = createFileRoute("/password/forgot")({
  component: ForgotPassword,
});

function ForgotPassword() {
  const form = useForm({
    defaultValues: {
      email: "",
    },
  });

  const {
    mutate: sendForgotPasswordEmail,
    data,
    isPending,
  } = useMutation(
    orpc.auth.forgotPassword.mutationOptions({
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
      onSuccess() {
        form.reset();
      },
    }),
  );

  return (
    <div className="flex flex-grow items-center justify-center">
      <form
        className="flex flex-col gap-5 flex-grow max-w-md"
        onSubmit={form.handleSubmit((values) => sendForgotPasswordEmail(values))}
      >
        <Typography type="h1">Forgot Password</Typography>
        {form.formState.errors.root?.message && (
          <Alert status="danger">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>{form.formState.errors.root.message}</Alert.Title>
            </Alert.Content>
          </Alert>
        )}
        {data && (
          <Alert status="success">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Success</Alert.Title>
              <Alert.Description>
                If an account with the email &quot;{data}&quot; exists, you will receive an email with a link to reset your password.
              </Alert.Description>
            </Alert.Content>
          </Alert>
        )}
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              type="email"
              isRequired
              isDisabled={!!data}
              isInvalid={fieldState.error ? true : undefined}
            >
              <Label>Email</Label>
              <Input />
              <Description>We'll send you an email with a link to reset your password.</Description>
              <FieldError>{fieldState.error?.message}</FieldError>
            </TextField>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" isPending={isPending} isDisabled={!!data}>
            Send Reset Password Email
          </Button>
        </div>
      </form>
    </div>
  );
}
