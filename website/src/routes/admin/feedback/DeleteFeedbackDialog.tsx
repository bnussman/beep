import React, { useState } from "react";
import { RouterOutput, trpc } from "../../../utils/trpc";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

interface Props {
  isOpen: boolean;
  feedback:
    | RouterOutput["feedback"]["feedback"]["feedback"][number]
    | undefined;
  onClose: () => void;
}

export function DeleteFeedbackDialog(props: Props) {
  const { isOpen, onClose, feedback } = props;

  const utils = trpc.useUtils();

  const { mutateAsync, isPending, error, reset } =
    trpc.feedback.deleteFeedback.useMutation();

  const handleClose = () => {
    reset();
    onClose();
  };

  const onDelete = async () => {
    await mutateAsync(feedback?.id ?? "");
    onClose();
    utils.feedback.feedback.invalidate();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle fontSize="lg" fontWeight="bold">
        Delete {feedback?.user.first} {feedback?.user.last}'s feedback?
      </DialogTitle>
      <DialogContent>
        {error && <Alert severity="error">{error.message}</Alert>}
        Are you sure you want to delete this feedback?
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button loading={isPending} color="error" onClick={onDelete}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
