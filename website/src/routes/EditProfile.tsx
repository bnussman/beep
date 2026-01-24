import React from "react";
import { ORPCError } from "@orpc/client";
import { Controller, useForm } from "react-hook-form";
import { createRoute } from "@tanstack/react-router";
import { RouterInput, useTRPC } from "../utils/trpc";
import { rootRoute } from "../utils/root";
import { useNotifications } from "@toolpad/core";
import { useMutation } from "@tanstack/react-query";
import { orpc, useUser } from "../utils/orpc";
import {
  Alert,
  Card,
  Typography,
  TextField,
  Avatar,
  CircularProgress,
  Stack,
  Button,
  Box,
} from "@mui/material";

type Values = RouterInput["user"]["edit"];

export const editProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile/edit",
  component: EditProfile,
});

export function EditProfile() {
  const trpc = useTRPC();
  const { data: user } = useUser();
  const notifications = useNotifications();

  const {
    handleSubmit,
    control,
    setError,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<Values>({
    defaultValues: {
      first: user?.first,
      last: user?.last,
      email: user?.email,
      phone: user?.phone,
      venmo: user?.venmo,
      cashapp: user?.cashapp,
    },
    values: user
      ? {
          first: user.first,
          last: user.last,
          email: user.email,
          phone: user.phone,
          venmo: user.venmo,
          cashapp: user.cashapp,
        }
      : undefined,
  });

  const { mutateAsync } = useMutation(orpc.user.edit.mutationOptions({
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

  const {
    mutateAsync: uploadPicture,
    isPending: isUploadPending,
    error: uploadError,
  } = useMutation(orpc.user.updatePicture.mutationOptions({
    onSuccess() {
      notifications.show("Successfully updated profile picture", {
        severity: "success",
      });
    },
    onError(error) {
      notifications.show(error.message, {
        severity: "error",
      });
    }
  }));

  const onSubmit = handleSubmit(async (variables) => {
    await mutateAsync(variables);

    notifications.show("Successfully updated profile", {
      severity: 'success'
    });
  });

  const uploadPhoto = async (picture: File | undefined) => {
    if (picture) {
      uploadPicture(picture);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Card sx={{ p: 3 }}>
      <form onSubmit={onSubmit}>
        <Stack spacing={2}>
          <Typography variant="h4" fontWeight="bold">
            Edit Profile
          </Typography>
          {errors.root?.message && (
            <Alert severity="error">{errors.root?.message}</Alert>
          )}
          {isUploadPending && (
            <Alert severity="info">
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography>Uploading Profile Photo</Typography>
                <CircularProgress size={16} />
              </Stack>
            </Alert>
          )}
          {uploadError && <Alert severity="error">{uploadError.message}</Alert>}
          <Stack direction="row" spacing={2}>
            <Stack spacing={2} flexGrow={1}>
              <Controller
                control={control}
                name="first"
                render={({ field, fieldState }) => (
                  <TextField
                    label="First Name"
                    value={field.value}
                    onChange={field.onChange}
                    error={Boolean(fieldState.error?.message)}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="last"
                render={({ field, fieldState }) => (
                  <TextField
                    label="Last Name"
                    value={field.value}
                    onChange={field.onChange}
                    error={Boolean(fieldState.error?.message)}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Stack>
            <label style={{ cursor: "pointer" }} htmlFor="photo">
              <Avatar
                sx={{ width: 128, height: 128 }}
                src={user?.photo ?? undefined}
              />
            </label>
            <input
              id="photo"
              type="file"
              onChange={(e) => uploadPhoto(e.target.files?.[0])}
              hidden
            />
          </Stack>
          <Controller
            control={control}
            name="email"
            render={({ field, fieldState }) => (
              <TextField
                label="Email"
                type="email"
                value={field.value}
                onChange={field.onChange}
                error={Boolean(fieldState.error?.message)}
                helperText={
                  (fieldState.error?.message ?? user.isEmailVerified)
                    ? user.isStudent
                      ? "Your email is verified and you are a student"
                      : "Your email is verified"
                    : "Your email is not verified"
                }
              />
            )}
          />
          <Controller
            control={control}
            name="phone"
            render={({ field, fieldState }) => (
              <TextField
                label="Phone"
                type="tel"
                value={field.value}
                onChange={field.onChange}
                error={Boolean(fieldState.error?.message)}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="venmo"
            render={({ field, fieldState }) => (
              <TextField
                label="Venmo"
                type="text"
                value={field.value}
                onChange={field.onChange}
                error={Boolean(fieldState.error?.message)}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="cashapp"
            render={({ field, fieldState }) => (
              <TextField
                label="Cash App"
                type="text"
                value={field.value}
                onChange={field.onChange}
                error={Boolean(fieldState.error?.message)}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Box display="flex" justifyContent="flex-end">
            <Button
              type="submit"
              variant="contained"
              loading={isSubmitting}
              disabled={!isDirty}
            >
              Save Profile
            </Button>
          </Box>
        </Stack>
      </form>
    </Card>
  );
}
