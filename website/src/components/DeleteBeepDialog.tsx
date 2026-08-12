import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "../utils/orpc";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

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
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Delete Beep?</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error">{error.message}</Alert>}
        Are you sure you want to delete this beep?
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          loading={isPending}
          onClick={() => deleteBeep(id)}
          color="error"
          variant="contained"
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
