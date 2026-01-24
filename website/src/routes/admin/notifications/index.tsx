import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { SendNotificationConfirmationDialog } from "./SendNotificationConfirmationDialog";
import { useNotifications } from "@toolpad/core";
import { Controller, useForm } from "react-hook-form";
import { createRoute } from "@tanstack/react-router";
import { Inputs, orpc } from "../../../utils/orpc";
import { ORPCError } from "@orpc/client";
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

type SendNotifictionVariables = Inputs["notification"]["sendNotification"];

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
    formState: { errors, isSubmitting },
  } = useForm<SendNotifictionVariables>({
    defaultValues: {
      title: '',
      body: '',
      emailMatch: '',
    }
  });

  const { mutateAsync: sendNotification } =
    useMutation(orpc.notification.sendNotification.mutationOptions({
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
      onSuccess(sent) {
        notifications.show(`Sent notification to ${sent} users.`, {
          severity: 'success',
        });
        reset();
      },
    }));

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
