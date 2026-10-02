import React from "react";
import { RouterInputs } from "../../../api/src";
import { useMutation } from "@tanstack/react-query";
import { orpc } from "../utils/orpc";
import { ORPCError } from "@orpc/client";
import { useForm, Controller } from "react-hook-form";
import {
  Alert,
  AlertDialog,
  Button,
  FieldError,
  Input,
  Label,
  TextArea,
  TextField,
  toast,
} from "@heroui/react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  id: string;
}

type Values = RouterInputs["notification"]["sendNotificationToUser"];

export function SendNotificationDialog(props: Props) {
  const { isOpen, onClose, id } = props;
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
        toast.success("Successfully sent notification!", { timeout: 5_000 });
        form.reset();
        onClose();
      },
      onError(error) {
        if (error instanceof ORPCError && error.data?.issues) {
          for (const issue of error.data?.issues) {
            form.setError(issue.path[0], { message: issue.message });
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
    <AlertDialog.Backdrop
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
    >
      <AlertDialog.Container>
        <AlertDialog.Dialog>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <AlertDialog.Header>
              <AlertDialog.Heading>Send Notification</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body className="flex flex-col gap-4">
            {form.formState.errors.root?.message && (
              <Alert status="danger">
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title>{form.formState.errors.root.message}</Alert.Title>
                </Alert.Content>
              </Alert>
            )}
            <Controller
              control={form.control}
              name="title"
              render={({ field, fieldState }) => (
                <TextField {...field} isInvalid={Boolean(fieldState.error)}>
                  <Label>Title</Label>
                  <Input />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </TextField>
              )}
            />
            <Controller
              control={form.control}
              name="body"
              render={({ field, fieldState }) => (
                <TextField {...field} isInvalid={Boolean(fieldState.error)}>
                  <Label>Body</Label>
                  <TextArea rows={2} />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </TextField>
              )}
            />
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button type="button" variant="tertiary" onPress={onClose}>
                Close
              </Button>
              <Button
                type="submit"
                isPending={form.formState.isSubmitting}
              >
                Send Notification
              </Button>
            </AlertDialog.Footer>
          </form>
        </AlertDialog.Dialog>
      </AlertDialog.Container>
    </AlertDialog.Backdrop>
  );
}
