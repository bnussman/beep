import React, { useState } from "react";
import { orpc } from "../utils/orpc";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useNotifications } from "@toolpad/core";
import {
  Alert,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
} from "@mui/material";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export function ClearQueueDialog(props: Props) {
  const { isOpen, onClose, userId } = props;

  const [stopBeeping, setStopBeeping] = useState<boolean>(true);
  const notifications = useNotifications();
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

        notifications.show(message, { severity: "success" });

        onClose();
      },
    }),
  );

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Clear user's queue?</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error">{error.message}</Alert>}
        <FormControlLabel
          control={<Checkbox />}
          label="Turn off user's Beeping status after clear?"
          checked={stopBeeping}
          onChange={() => setStopBeeping((prev) => !prev)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          loading={isPending}
          variant="contained"
          onClick={() => mutate({ userId, stopBeeping })}
        >
          Clear Queue
        </Button>
      </DialogActions>
    </Dialog>
  );
}
