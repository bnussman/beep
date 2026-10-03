import React, { useState } from "react";
import { RouterInputs } from "../../../../../api/src";
import { orpc } from "../../../utils/orpc";
import { ORPCError } from "@orpc/client";
import { useMutation } from "@tanstack/react-query";
import { SendNotificationConfirmationDialog } from "../../../components/SendNotificationConfirmationDialog";
import { Controller, useForm } from "react-hook-form";
import { createFileRoute } from "@tanstack/react-router";
import {
  Alert,
  Button,
  FieldError,
  Input,
  Label,
  TextArea,
  TextField,
  toast,
  Typography,
} from "@heroui/react";

type SendNotifictionVariables = RouterInputs["notification"]["sendNotification"];

export const Route = createFileRoute('/admin/notifications/')({
  component: Notifications,
});

function Notifications() {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const {
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SendNotifictionVariables>({ mode: "onChange" });

  const { mutateAsync: sendNotification } =
    useMutation(orpc.notification.sendNotification.mutationOptions({
      onError(e) {
        if (e instanceof ORPCError && e.data?.issues) {
          for (const issue of e.data.issues) {
            setError(issue.path[0], { message: issue.message });
          }
        } else {
          setError("root", { message: e.message });
        }
      },
      onSuccess(sent) {
        toast.success(`Sent notification to ${sent} users.`, { timeout: 5_000 });
      },
    }));

  const onConfirm = handleSubmit(async (values) => {
    setIsConfirmOpen(false);
    await sendNotification(values);
  });

  return (
      <div className="flex flex-col gap-4">
        <Typography type="h1">
          Notifications
        </Typography>
        <Typography type="body">Use this tool to send mass notifications.</Typography>
        <Alert status="warning">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>
              Please thoroughly review notifications before sending them.
            </Alert.Title>
            <Alert.Description>
              If no match is specified, the notification will be sent to all users.
            </Alert.Description>
          </Alert.Content>
        </Alert>
        {errors.root?.message && (
          <Alert status="danger">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>{errors.root.message}</Alert.Title>
            </Alert.Content>
          </Alert>
        )}
        <Controller
          control={control}
          name="title"
          render={({ field, fieldState }) => (
            <TextField {...field} isRequired isInvalid={fieldState.error ? true : undefined}>
              <Label>Title</Label>
              <Input />
              <FieldError>{fieldState.error?.message}</FieldError>
            </TextField>
          )}
        />
        <Controller
          control={control}
          name="emailMatch"
          render={({ field, fieldState }) => (
            <TextField {...field} isInvalid={fieldState.error ? true : undefined}>
              <Label>Match</Label>
              <Input placeholder="%@appstate.edu" />
              <FieldError>{fieldState.error?.message}</FieldError>
            </TextField>
          )}
        />
        <Controller
          control={control}
          name="body"
          render={({ field, fieldState }) => (
            <TextField {...field} isRequired isInvalid={fieldState.error ? true : undefined}>
              <Label>Body</Label>
              <TextArea rows={2} />
              <FieldError>{fieldState.error?.message}</FieldError>
            </TextField>
          )}
        />
        <div className="flex justify-end">
          <Button
            onPress={() => setIsConfirmOpen(true)}
            isPending={isSubmitting}
          >
            Send
          </Button>
        </div>
        <SendNotificationConfirmationDialog
          open={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={onConfirm}
        />
      </div>
  );
}
