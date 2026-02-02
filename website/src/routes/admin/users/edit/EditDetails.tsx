import React from "react";
import { ORPCError } from "@orpc/client";
import { Inputs, orpc } from "../../../../utils/orpc";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { editUserRoute } from ".";
import { useNotifications } from "@toolpad/core";
import {
  Alert,
  FormControlLabel,
  Checkbox,
  Stack,
  Button,
  TextField,
} from "@mui/material";

type Values = Inputs["user"]["editAdmin"]["data"];

export function EditDetails() {
  const notifications = useNotifications();

  const { userId } = editUserRoute.useParams();
  const { data: user } = useQuery(
    orpc.user.updates.experimental_liveOptions({ input: userId })
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

  const { mutateAsync: editUser } = useMutation(orpc.user.editAdmin.mutationOptions({
    onSuccess(user) {
      notifications.show(`Successfully edited ${user.first}'s profile`, {
        severity: "success",
      });
    },
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
