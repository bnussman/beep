import React from "react";
import { useTRPC } from "../../../utils/trpc";
import {
  Dialog,
  Alert,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  isOpen: boolean;
  id: string | undefined;
  onClose: () => void;
  onSuccess?: () => void;
}

export function DeleteRatingDialog({ isOpen, onClose, id, onSuccess }: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const {
    mutateAsync: deleteRating,
    isPending,
    error,
  } = useMutation(trpc.rating.deleteRating.mutationOptions({
    onSuccess() {
      queryClient.invalidateQueries(trpc.rating.ratings.pathFilter());
    },
  }));

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
