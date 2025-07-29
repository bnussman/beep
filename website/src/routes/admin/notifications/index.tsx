import React, { useState } from "react";
import { SendNotificationConfirmationDialog } from "./SendNotificationConfirmationDialog";
import { useNotifications } from "@toolpad/core";
import { Controller, useForm } from "react-hook-form";
import { createRoute } from "@tanstack/react-router";
import { RouterInput, trpc } from "../../../utils/trpc";
import { adminRoute } from "..";
import {
  Alert,
  TextField,
  Typography,
  Button,
  Stack,
  Box,
  Card,
} from "@mui/material";

type SendNotifictionVariables = RouterInput["notification"]["sendNotification"];

export const notificationsRoute = createRoute({
  component: Notifications,
  path: "/notifications",
  getParentRoute: () => adminRoute,
});

export function Notifications() {
  const notifications = useNotifications();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const {
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting, isValid },
  } = useForm<SendNotifictionVariables>({ mode: "onChange" });

  const { mutateAsync: sendNotification } =
    trpc.notification.sendNotification.useMutation({
      onError(e) {
        if (e.data?.fieldErrors) {
          for (const key in e.data?.fieldErrors ?? {}) {
            setError(key as keyof SendNotifictionVariables, {
              message: e.data?.fieldErrors?.[key]?.[0],
            });
          }
        } else {
          setError("root", { message: e.message });
        }
      },
      onSuccess(sent) {
        notifications.show(`Sent notification to ${sent} users.`, {
          severity: 'success',
        });
      },
    });

  const onConfirm = handleSubmit(async (values) => {
    setIsConfirmOpen(false);
    await sendNotification(values);
  });

  return (
    <Card sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Typography variant="h4" fontWeight="bold">
          Notifications
        </Typography>
        <Typography>Use this tool to send mass notifications.</Typography>
        <Alert severity="warning">
          Please thoroughly review notifications before sending them. If no match
          is specified, the notification will be sent to all users.
        </Alert>
        {errors.root?.message && (
          <Alert severity="error">{errors.root.message}</Alert>
        )}
        <Controller
          control={control}
          name="title"
          render={({ field, fieldState }) => (
            <TextField
              label="Title"
              error={Boolean(fieldState.error?.message)}
              helperText={fieldState.error?.message}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <Controller
          control={control}
          name="emailMatch"
          render={({ field, fieldState }) => (
            <TextField
              label="Match"
              error={Boolean(fieldState.error?.message)}
              helperText={fieldState.error?.message}
              value={field.value}
              onChange={field.onChange}
              placeholder="%@appstate.edu"
            />
          )}
        />
        <Controller
          control={control}
          name="body"
          render={({ field, fieldState }) => (
            <TextField
              label="Body"
              error={Boolean(fieldState.error?.message)}
              helperText={fieldState.error?.message}
              value={field.value}
              onChange={field.onChange}
              multiline
              rows={2}
            />
          )}
        />
        <Box display="flex" justifyContent="flex-end">
          <Button
            onClick={() => setIsConfirmOpen(true)}
            variant="contained"
            loading={isSubmitting}
          >
            Send
          </Button>
        </Box>
        <SendNotificationConfirmationDialog
          open={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={onConfirm}
        />
      </Stack>
    </Card>
  );
}
