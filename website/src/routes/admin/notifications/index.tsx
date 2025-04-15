import React, { useState } from "react";
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
} from "@mui/material";
import { useToast } from "@chakra-ui/react";
import { SendNotificationConfirmationDialog } from "./SendNotificationConfirmationDialog";

type SendNotifictionVariables = RouterInput["notification"]["sendNotification"];

export const notificationsRoute = createRoute({
  component: Notifications,
  path: "/notifications",
  getParentRoute: () => adminRoute,
});

export function Notifications() {
  const toast = useToast();

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
        if (e.data?.zodError?.fieldErrors) {
          for (const key in e.data?.zodError?.fieldErrors ?? {}) {
            setError(key as keyof SendNotifictionVariables, {
              message: e.data?.zodError?.fieldErrors?.[key]?.[0],
            });
          }
        } else {
          setError("root", { message: e.message });
        }
      },
    });

  const onConfirm = handleSubmit(async (values) => {
    setIsConfirmOpen(false);

    try {
      const sent = await sendNotification(values);

      toast({
        title: `Sent notification to ${sent} users.`,
      });

      reset();
    } catch (error) {
      // ...
    }
  });

  return (
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
  );
}
