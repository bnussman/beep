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
import React, { useState } from "react";
import { trpc } from "../utils/trpc";
import { useToast } from "@chakra-ui/react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export function ClearQueueDialog(props: Props) {
  const { isOpen, onClose, userId } = props;

  const [stopBeeping, setStopBeeping] = useState<boolean>(true);
  const toast = useToast;
  const utils = trpc.useUtils();

  const { mutate, isPending, error } = trpc.beep.clearQueue.useMutation({
    onSuccess() {
      utils.beeper.queue.invalidate(userId);

      toast({
        title: "Queue Cleared",
        description: `Users's queue has been cleared ${stopBeeping ? " and they have stopped beeping." : ""}`,
        status: "success",
      });

      onClose();
    },
  });

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Clear user's queue?</DialogTitle>
      <DialogContent>
        <Stack spacing={1}>
          {error && <Alert severity="error">{error.message}</Alert>}
          <FormControlLabel
            control={<Checkbox />}
            label="Turn off user's Beeping status after clear?"
            checked={stopBeeping}
            onChange={() => setStopBeeping(!stopBeeping)}
          />
        </Stack>
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
