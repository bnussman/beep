import React from "react";
import { orpc, Outputs } from "../../../utils/orpc";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { RouterOutput } from "../../../utils/trpc";
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
    | Outputs["feedback"]["feedback"]["feedback"][number]
    | undefined;
  onClose: () => void;
}

export function DeleteFeedbackDialog(props: Props) {
  const { isOpen, onClose, feedback } = props;

  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error, reset } =
    useMutation(orpc.feedback.deleteFeedback.mutationOptions());

  const handleClose = () => {
    reset();
    onClose();
  };

  const onDelete = async () => {
    await mutateAsync(feedback?.id ?? "");
    onClose();
    queryClient.invalidateQueries({ queryKey: orpc.feedback.feedback.key() });
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
