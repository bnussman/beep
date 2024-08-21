import React from "react";
import { Dialog } from "../../../components/Dialog";
import { Error } from "../../../components/Error";
import { AlertDialogBody, AlertDialogFooter, Button } from "@chakra-ui/react";
import { trpc } from "../../../utils/trpc";

interface Props {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteUserDialog({ isOpen, onClose, userId }: Props) {
  const { mutateAsync: deleteUser, isPending, error } = trpc.user.deleteUser.useMutation();

  const onDelete = async () => {
    await deleteUser(userId);
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Delete User?"
    >
      <AlertDialogBody>
        {error && <Error>{error.message}</Error>}
        Are you sure you want to delete user {userId}?
      </AlertDialogBody>
      <AlertDialogFooter>
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button isLoading={isPending} colorScheme="red" onClick={onDelete} ml={3}>
          Delete
        </Button>
      </AlertDialogFooter>
    </Dialog>
  );
}
