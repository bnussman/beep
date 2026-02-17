import React from "react";
import { useTRPC } from "../../../utils/trpc";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  id: string;
}

export function DeleteBeepDialog({ isOpen, onClose, id }: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const {
    mutateAsync: deleteBeep,
    isPending,
    error,
  } = useMutation(
    trpc.beep.deleteBeep.mutationOptions({
      onSuccess() {
        queryClient.invalidateQueries(trpc.beep.beeps.queryFilter());
        onClose();
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
