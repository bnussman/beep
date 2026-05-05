import React from "react";
import { useTRPC } from "../utils/trpc";
import { useRouter } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Alert,
  Button,
  Dialog,
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
  const trpc = useTRPC();
  const router = useRouter();

  const { data: user } = useQuery(
    trpc.user.user.queryOptions(userId, { enabled: isOpen }),
  );

  const {
    mutate: deleteUser,
    isPending,
    error,
  } = useMutation(
    trpc.user.deleteUser.mutationOptions({
      onSuccess() {
        router.history.back();
        onClose();
      },
    }),
  );

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Delete User?</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error">{error.message}</Alert>}
        Are you sure you want to delete {user?.first} {user?.last}?
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          loading={isPending}
          color="error"
          variant="contained"
          onClick={() => deleteUser(userId)}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
