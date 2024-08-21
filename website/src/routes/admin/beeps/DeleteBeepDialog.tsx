import React from "react";
import { Dialog } from "../../../components/Dialog";
import { Error } from "../../../components/Error";
import { AlertDialogBody, AlertDialogFooter, Button } from "@chakra-ui/react";
import { trpc } from "../../../utils/trpc";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  id: string;
}

export function DeleteBeepDialog({ isOpen, onClose, id }: Props) {
  const {
    mutateAsync: deleteBeep,
    isPending,
    error
  } = trpc.beep.deleteBeep.useMutation();

  const onDelete = async () => {
    await deleteBeep(id);
    onClose();
  };

  return (
    <Dialog title="Delete Beep?" isOpen={isOpen} onClose={onClose}>
      <AlertDialogBody>
        {error && <Error>{error.message}</Error>}
        Are you sure you want to delete this beep?
      </AlertDialogBody>
      <AlertDialogFooter>
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button isLoading={isPending} onClick={onDelete} colorScheme="red">
          Delete
        </Button>
      </AlertDialogFooter>
    </Dialog>
  );
}
