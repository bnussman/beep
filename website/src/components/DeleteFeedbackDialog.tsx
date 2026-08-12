import React from "react";
import { orpc } from "../utils/orpc";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { RouterOutputs } from "../../../orpc/src";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

type Feedback = RouterOutputs["feedback"]["feedback"]["feedback"][number];

interface Props {
  isOpen: boolean;
  feedback: Feedback | undefined;
  onClose: () => void;
}

export function DeleteFeedbackDialog(props: Props) {
  const { isOpen, onClose, feedback } = props;

  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error, reset } = useMutation(
    orpc.feedback.deleteFeedback.mutationOptions({
      onSuccess() {
        onClose();

        queryClient.invalidateQueries({
          queryKey: orpc.feedback.feedback.key()
        });
      }
    })
  );

  const handleClose = () => {
    reset();
    onClose();
  };

  const onDelete = () => {
    if (feedback) {
      mutateAsync(feedback.id);
    }
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
