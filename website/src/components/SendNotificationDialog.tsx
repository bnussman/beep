import React from "react";
import { RouterInput, trpc } from "../utils/trpc";
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
import { useToast } from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  id: string;
}

export function SendNotificationDialog(props: Props) {
  const { isOpen, onClose, id } = props;
  const toast = useToast();

  const form = useForm<RouterInput["notification"]["sendNotificationToUser"]>({
    defaultValues: {
      userId: id,
      title: "",
      body: "",
    },
  });

  const { mutateAsync: sendNotification } =
    trpc.notification.sendNotificationToUser.useMutation({
      onError(errors) {
        if (errors.data?.zodError?.fieldErrors) {
          for (const field in errors.data?.zodError?.fieldErrors) {
            form.setError(
              field as keyof RouterInput["notification"]["sendNotificationToUser"],
              {
                message: errors.data?.zodError?.fieldErrors[field]?.[0],
              },
            );
          }
        } else {
          form.setError("root", { message: errors.message });
        }
      },
    });

  const onSubmit = async (
    values: RouterInput["notification"]["sendNotificationToUser"],
  ) => {
    await sendNotification(values);
    toast({ title: "Successfully sent notification!", status: "success" });
    form.reset();
    onClose();
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
