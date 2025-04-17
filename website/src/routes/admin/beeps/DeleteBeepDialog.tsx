import React from "react";
import { trpc } from "../../../utils/trpc";
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
  id: string;
}

export function DeleteBeepDialog({ isOpen, onClose, id }: Props) {
  const {
    mutateAsync: deleteBeep,
    isPending,
    error,
  } = trpc.beep.deleteBeep.useMutation();

  const onDelete = async () => {
    await deleteBeep(id);
    onClose();
  };

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
          onClick={onDelete}
          color="error"
          variant="contained"
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
