import React from "react";
import { Dialog } from "../../../components/Dialog";
import { Error } from "../../../components/Error";
import { AlertDialogBody, AlertDialogFooter, Button } from "@chakra-ui/react";
import { trpc } from "../../../utils/trpc";
import { useRouter } from "@tanstack/react-router";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  id: string;
}

export function DeleteRatingDialog({ isOpen, onClose, id }: Props) {
  const { mutateAsync: deleteRating, isPending, error } = trpc.rating.deleteRating.useMutation();
  const { history } = useRouter();

  const onDelete = async () => {
    await deleteRating({ ratingId: id });
    history.go(-1);
    onClose();
  };

  return (
    <Dialog title="Delete Rating?" isOpen={isOpen} onClose={onClose}>
      <AlertDialogBody>
        {error && <Error>{error.message}</Error>}
        Are you sure you want to delete this rating?
      </AlertDialogBody>
      <AlertDialogFooter>
        <Button onClick={onClose} mr={2}>Cancel</Button>
        <Button isLoading={isPending} onClick={onDelete} colorScheme="red">Delete</Button>
      </AlertDialogFooter>
    </Dialog>
  );
}
