import React, { useState } from "react";
import { orpc } from "../utils/orpc";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { Alert, AlertDialog, Button, Checkbox, toast } from "@heroui/react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export function ClearQueueDialog(props: Props) {
  const { isOpen, onClose, userId } = props;

  const [stopBeeping, setStopBeeping] = useState<boolean>(true);
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation(
    orpc.beep.clearQueue.mutationOptions({
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: orpc.beeper.queue.queryKey({ input: userId })
        });

        const message = stopBeeping
          ? "Users's queue has been cleared and they are not longer beepering."
          : "User's queue has been cleared.";

        toast.success(message, { timeout: 5_000 });

        onClose();
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
            <AlertDialog.Heading>Clear user's queue?</AlertDialog.Heading>
          </AlertDialog.Header>
          <AlertDialog.Body className="flex flex-col gap-4">
            {error && (
              <Alert status="danger" className="bg-surface-secondary">
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title>{error.message}</Alert.Title>
                </Alert.Content>
              </Alert>
            )}
            <Checkbox
              isSelected={stopBeeping}
              onChange={setStopBeeping}
            >
              <Checkbox.Content>
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
                Turn off user's Beeping status after clear?
              </Checkbox.Content>
            </Checkbox>
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button variant="tertiary" onPress={onClose}>Cancel</Button>
            <Button
              isPending={isPending}
              variant="danger"
              onPress={() => mutate({ userId, stopBeeping })}
            >
              Clear Queue
            </Button>
          </AlertDialog.Footer>
        </AlertDialog.Dialog>
      </AlertDialog.Container>
    </AlertDialog.Backdrop>
  );
}
