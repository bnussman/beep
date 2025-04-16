import React from "react";
import { trpc } from "../../../utils/trpc";
import {
  Dialog,
  Alert,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

interface Props {
  isOpen: boolean;
  id: string | undefined;
  onClose: () => void;
  onSuccess?: () => void;
}

export function DeleteRatingDialog({ isOpen, onClose, id, onSuccess }: Props) {
  const utils = trpc.useUtils();
  const {
    mutateAsync: deleteRating,
    isPending,
    error,
  } = trpc.rating.deleteRating.useMutation({
    onSuccess() {
      utils.rating.ratings.invalidate();
    },
  });

  const onDelete = async () => {
    await deleteRating({ ratingId: id ?? "" });
    onClose();
    onSuccess?.();
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Delete Rating?</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error">{error.message}</Alert>}
        Are you sure you want to delete this rating?
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button loading={isPending} onClick={onDelete} color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
