import React from "react";
import { orpc } from "../../../../../utils/orpc";
import { ORPCError } from "@orpc/client";
import { createFileRoute } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { RouterInputs } from "../../../../../../../api/src";
import {
  Alert,
  Button,
  Checkbox,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
  toast,
} from "@heroui/react";

type Values = RouterInputs["user"]["editAdmin"]["data"];

export const Route = createFileRoute("/admin/users/$userId/edit/$")({
  component: EditDetails,
});

function EditDetails() {
  const { userId } = Route.useParams();

  const { data: user } = useQuery(
    orpc.user.user.queryOptions({ input: userId })
  );

  const values = {
    first: user?.first,
    last: user?.last,
    email: user?.email,
    phone: user?.phone,
    photo: user?.photo ?? undefined,
    venmo: user?.venmo ?? undefined,
    cashapp: user?.cashapp ?? undefined,
    isEmailVerified: user?.isEmailVerified,
    isStudent: user?.isStudent,
    isBeeping: user?.isBeeping,
  };

  const {
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<Values>({
    defaultValues: values,
    values,
  });

  const { mutateAsync: editUser } = useMutation(
    orpc.user.editAdmin.mutationOptions({
      onSuccess(user) {
        toast.success(`Successfully edited ${user.first}'s profile`, { timeout: 5_000 });
      },
      onError(error) {
        if (error instanceof ORPCError && error.data?.issues) {
          for (const issue of error.data?.issues) {
            setError(issue.path[0], { message: issue.message });
          }
        } else {
          setError("root", { message: error.message });
        }
      },
    }),
  );

  const onSubmit = async (data: Values) => {
    await editUser({ userId, data });
  };

  const keys = values ? Object.keys(values) : [];

  return (
    <Form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      {errors.root?.message && (
        <Alert status="danger">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>{errors.root.message}</Alert.Title>
          </Alert.Content>
        </Alert>
      )}
      {keys.map((_key) => {
        const key = _key as keyof Values;
        const type = typeof user?.[key];

        return (
          <Controller
            control={control}
            name={key}
            key={key}
            render={({ field, fieldState }) => {
              if (type === "boolean") {
                return (
                  <Checkbox
                    isSelected={Boolean(field.value)}
                    onChange={field.onChange}
                  >
                    <Checkbox.Content>
                      <Checkbox.Control>
                        <Checkbox.Indicator />
                      </Checkbox.Control>
                      {key}
                    </Checkbox.Content>
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Checkbox>
                );
              }
              return (
                <TextField
                  {...field}
                  value={String(field.value ?? "")}
                  isInvalid={fieldState.error ? true : undefined}
                >
                  <Label>{key}</Label>
                  <Input />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </TextField>
              );
            }}
          />
        );
      })}
      <Button className="self-end" type="submit" isPending={isSubmitting} isDisabled={!isDirty}>
        Update User
      </Button>
    </Form>
  );
}
