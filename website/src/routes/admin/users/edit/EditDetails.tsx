import React from "react";
import {
  Alert,
  FormControlLabel,
  Checkbox,
  Stack,
  Button,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { editUserRoute } from ".";
import { RouterInput, trpc } from "../../../../utils/trpc";
import { useToast } from "@chakra-ui/react";

type Values = RouterInput["user"]["editAdmin"]["data"];

export function EditDetails() {
  const toast = useToast();

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

  const { mutateAsync: editUser, error: editError } =
    trpc.user.editAdmin.useMutation({
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
    const user = await editUser({ userId, data });
    toast({
      status: "success",
      title: "Success",
      description: `Successfully edited ${user.first}'s profile`,
    });
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
