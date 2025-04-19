import React from "react";
import { Controller, useForm } from "react-hook-form";
import { editUserRoute } from ".";
import { RouterInput, trpc } from "../../../../utils/trpc";
import { useNotifications } from "@toolpad/core";
import {
  Alert,
  FormControlLabel,
  Checkbox,
  Stack,
  Button,
  TextField,
} from "@mui/material";

type Values = RouterInput["user"]["editAdmin"]["data"];

export function EditDetails() {
  const notifications = useNotifications();

  const { userId } = editUserRoute.useParams();
  const { data: user } = trpc.user.user.useQuery(userId);

  const values = {
    first: user?.first,
    last: user?.last,
    email: user?.email,
    phone: user?.phone,
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

  const { mutateAsync: editUser } = trpc.user.editAdmin.useMutation({
    onSuccess(user) {
      notifications.show(`Successfully edited ${user.first}'s profile`, {
        severity: "success",
      });
    },
    onError(errors) {
      if (errors.data?.zodError?.fieldErrors) {
        for (const field in errors.data?.zodError?.fieldErrors) {
          setError(field as keyof Values, {
            message: errors.data?.zodError?.fieldErrors[field]?.[0],
          });
        }
      } else {
        setError("root", { message: errors.message });
      }
    },
  });

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
