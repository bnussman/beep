import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "../utils/orpc";
import { Alert, AlertDialog, Button } from "@heroui/react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  id: string;
}

export function DeleteBeepDialog({ isOpen, onClose, id, onSuccess }: Props) {
  const queryClient = useQueryClient();

  const {
    mutateAsync: deleteBeep,
    isPending,
    error,
  } = useMutation(
    orpc.beep.deleteBeep.mutationOptions({
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: orpc.beep.beeps.key()
        });
        onClose();
        onSuccess?.();
      },
    }),
  );

  return (
    <AlertDialog.Backdrop
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
    >
      <AlertDialog.Container>
        <AlertDialog.Dialog>
          <AlertDialog.Header>
            <AlertDialog.Heading>Delete Beep?</AlertDialog.Heading>
          </AlertDialog.Header>
          <AlertDialog.Body className="flex flex-col gap-4">
            {error && (
              <Alert status="danger">
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title>{error.message}</Alert.Title>
                </Alert.Content>
              </Alert>
            )}
            Are you sure you want to delete this beep?
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button variant="tertiary" onPress={onClose}>Cancel</Button>
            <Button
              isPending={isPending}
              variant="danger"
              onPress={() => deleteBeep(id)}
            >
              Delete
            </Button>
          </AlertDialog.Footer>
        </AlertDialog.Dialog>
      </AlertDialog.Container>
    </AlertDialog.Backdrop>
  );
}
