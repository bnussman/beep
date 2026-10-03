import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { orpc } from "../../utils/orpc";
import { ORPCError } from "@orpc/client";
import { Alert, Button, FieldError, Form, Input, Label, TextField, Typography } from "@heroui/react";

export const Route = createFileRoute('/password/change')({
  component: ChangePassword,
});

interface Values {
  password: string;
  confirmPassword: string;
}

function ChangePassword() {
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
    <div className="flex grow items-center justify-center">
      <Form className="flex flex-col gap-4 grow max-w-md" onSubmit={form.handleSubmit(onSubmit)}>
        <Typography type="h1">
          Change Password
        </Typography>
        {data && (
          <Alert status="success">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Successfully changed your password</Alert.Title>
            </Alert.Content>
          </Alert>
        )}
        {form.formState.errors.root?.message && (
          <Alert status="danger">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>{form.formState.errors.root.message}</Alert.Title>
            </Alert.Content>
          </Alert>
        )}
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <TextField {...field} isRequired minLength={6} isInvalid={fieldState.error ? true : undefined}>
              <Label>Password</Label>
              <Input type="password" autoComplete="new-password" />
              <FieldError>{fieldState.error?.message}</FieldError>
            </TextField>
          )}
        />
        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <TextField {...field} isRequired minLength={6} isInvalid={fieldState.error ? true : undefined}>
              <Label>Confirm Password</Label>
              <Input type="password" autoComplete="new-password" />
              <FieldError>{fieldState.error?.message}</FieldError>
            </TextField>
          )}
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            isPending={form.formState.isSubmitting}
          >
            Update password
          </Button>
        </div>
      </Form>
    </div>
  );
}
