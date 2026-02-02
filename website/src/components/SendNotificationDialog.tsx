import React from "react";
import { ORPCError } from "@orpc/client";
import { Inputs, orpc } from "../utils/orpc";
import { useMutation } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { useNotifications } from "@toolpad/core";
import {
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
} from "@mui/material";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  id: string;
}

type Values = Inputs["notification"]["sendNotificationToUser"];

export function SendNotificationDialog(props: Props) {
  const { isOpen, onClose, id } = props;
  const notifications = useNotifications();

  const form = useForm<Values>({
    defaultValues: {
      userId: id,
      title: "",
      body: "",
    },
  });

  const { mutateAsync: sendNotification } = useMutation(
    orpc.notification.sendNotificationToUser.mutationOptions({
      onSuccess() {
        notifications.show("Successfully sent notification!", { severity: "success" });
        form.reset();
        onClose();
      },
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
    })
  );

  const onSubmit = async (values: Values) => {
    await sendNotification(values);
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <DialogTitle>Send Notification</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            {form.formState.errors.root?.message && (
              <Alert severity="error">{form.formState.errors.root.message}</Alert>
            )}
            <Controller
              control={form.control}
              name="title"
              render={({ field, fieldState }) => (
                <TextField
                  label="Title"
                  value={field.value}
                  onChange={field.onChange}
                  error={Boolean(fieldState.error?.message)}
                  helperText={fieldState.error?.message}
                />
              )}
            />
            <Controller
              control={form.control}
              name="body"
              render={({ field, fieldState }) => (
                <TextField
                  label="Body"
                  value={field.value}
                  onChange={field.onChange}
                  error={Boolean(fieldState.error?.message)}
                  helperText={fieldState.error?.message}
                  multiline
                  rows={2}
                />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
          <Button
            variant="contained"
            loading={form.formState.isSubmitting}
            type="submit"
          >
            Send Notification
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
