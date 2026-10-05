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
  userId: string;
}

type Values = RouterInputs["user"]["migrateEntitiesToUser"];

export function MigrateUserDialog(props: Props) {
  const { isOpen, onClose: _onClose, userId } = props;

  const values = {
    fromUserId: userId,
    toUserId: "",
  }

  const form = useForm<Values>({
    defaultValues: values,
    values,
  });

  const { mutate: migrate, isPending, reset } = useMutation(
    orpc.user.migrateEntitiesToUser.mutationOptions({
      onSuccess(data, variables) {
        toast.success("Successfully migrated user", {
          description: `Migrated entities from user ${variables.fromUserId} to ${variables.toUserId}.`
        });
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

  const onClose = () => {
    form.reset();
    reset();
    _onClose();
  };

  const onSubmit = (values: Values) => {
    migrate(values);
  };

  return (
    <AlertDialog.Backdrop isOpen={isOpen} onOpenChange={onClose}>
      <AlertDialog.Container>
        <AlertDialog.Dialog>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <AlertDialog.Header>
              <AlertDialog.Heading>Migrate User's Entities</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body className="flex flex-col gap-4">
            {form.formState.errors.root?.message && (
              <Alert status="danger" className="bg-surface-secondary">
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title>{form.formState.errors.root.message}</Alert.Title>
                </Alert.Content>
              </Alert>
            )}
            <Controller
              control={form.control}
              name="toUserId"
              render={({ field, fieldState }) => (
                <TextField {...field} isInvalid={Boolean(fieldState.error)} variant="secondary">
                  <Label>New User ID</Label>
                  <Input />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </TextField>
              )}
            />
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button type="button" variant="tertiary" onPress={onClose}>
                Close
              </Button>
              <Button type="submit" isPending={isPending}>
                Migrate
              </Button>
            </AlertDialog.Footer>
          </form>
        </AlertDialog.Dialog>
      </AlertDialog.Container>
    </AlertDialog.Backdrop>
  );
}
