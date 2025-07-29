import React from "react";
import { Controller, useForm } from "react-hook-form";
import { editUserRoute } from ".";
import { RouterInput, useTRPC } from "../../../../utils/trpc";
import { useNotifications } from "@toolpad/core";
import {
  Alert,
  FormControlLabel,
  Checkbox,
  Stack,
  Button,
  TextField,
} from "@mui/material";

import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

type Values = RouterInput["user"]["editAdmin"]["data"];

export function EditDetails() {
  const trpc = useTRPC();
  const notifications = useNotifications();

  const { userId } = editUserRoute.useParams();
  const { data: user } = useQuery(trpc.user.user.queryOptions(userId));

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

  const { mutateAsync: editUser } = useMutation(trpc.user.editAdmin.mutationOptions({
    onSuccess(user) {
      notifications.show(`Successfully edited ${user.first}'s profile`, {
        severity: "success",
      });
    },
    onError(error) {
      if (error.data?.fieldErrors) {
        for (const field in error.data?.fieldErrors) {
          setError(field as keyof Values, {
            message: error.data?.fieldErrors[field]?.[0],
          });
        }
      } else {
        setError("root", { message: error.message });
      }
    },
  }));

  const onSubmit = async (data: Values) => {
    await editUser({ userId, data });
  };

  const keys = values ? Object.keys(values) : [];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2}>
        {errors.root?.message && (
          <Alert severity="error">{errors.root.message}</Alert>
        )}
        {keys.map((_key) => {
          const key = _key as keyof Values;
          const type = typeof user?.[key];

          return (
            <Controller
              control={control}
              name={key}
              render={({ field, fieldState }) => {
                if (type === "boolean") {
                  return (
                    <FormControlLabel
                      label={key}
                      control={<Checkbox />}
                      checked={Boolean(field.value)}
                      onChange={field.onChange}
                    />
                  );
                }
                return (
                  <TextField
                    label={key}
                    value={field.value}
                    onChange={field.onChange}
                    error={Boolean(fieldState.error?.message)}
                    helperText={fieldState.error?.message}
                  />
                );
              }}
            />
          );
        })}
        <Button
          type="submit"
          variant="contained"
          loading={isSubmitting}
          disabled={!isDirty}
        >
          Update User
        </Button>
      </Stack>
    </form>
  );
}
