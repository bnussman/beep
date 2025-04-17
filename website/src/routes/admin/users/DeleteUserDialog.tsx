import React from "react";
import { trpc } from "../../../utils/trpc";
import { useRouter } from "@tanstack/react-router";
import Dialog from "@mui/material/Dialog";
import {
  Alert,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

interface Props {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteUserDialog({ isOpen, onClose, userId }: Props) {
  const router = useRouter();
  const {
    mutateAsync: deleteUser,
    isPending,
    error,
  } = trpc.user.deleteUser.useMutation();

  const onDelete = async () => {
    await deleteUser(userId);
    router.history.back();
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Delete User?</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error">{error.message}</Alert>}
        Are you sure you want to delete user {userId}?
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          loading={isPending}
          color="error"
          variant="contained"
          onClick={onDelete}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
