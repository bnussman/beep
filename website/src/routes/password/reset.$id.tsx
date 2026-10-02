import React from "react";
import { orpc } from "../../utils/orpc";
import { ORPCError } from "@orpc/client";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { createFileRoute } from "@tanstack/react-router";
import { Alert, Button, FieldError, Form, Input, Label, TextField, Typography } from "@heroui/react";

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
    <div className="mx-auto w-full max-w-xl rounded-lg border border-separator bg-surface p-6">
      <Form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <Typography type="h1">
            Reset Password
          </Typography>
          {errors.root?.message && (
            <Alert status="danger">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>{errors.root.message}</Alert.Title>
              </Alert.Content>
            </Alert>
          )}
          {data && (
            <Alert status="success">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>Successfully changed password</Alert.Title>
              </Alert.Content>
            </Alert>
          )}
          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => (
              <TextField {...field} isInvalid={fieldState.error ? true : undefined}>
                <Label>Password</Label>
                <Input type="password" autoComplete="new-password" />
                <FieldError>{fieldState.error?.message}</FieldError>
              </TextField>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit" isPending={isSubmitting}>
              Reset Password
            </Button>
          </div>
      </Form>
    </div>
  );
}
