import React from "react";
import { useMutation } from "@apollo/client";
import { Dialog } from "../../../components/Dialog";
import { Error } from "../../../components/Error";
import { AlertDialogBody, AlertDialogFooter, Button } from "@chakra-ui/react";
import { graphql } from "gql.tada";
import { trpc } from "../../../utils/trpc";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  id: string;
}

export function DeleteRatingDialog({ isOpen, onClose, id }: Props) {
  const { mutateAsync: deleteRating, isPending, error } = trpc.rating.deleteRating.useMutation();

  const onDelete = async () => {
    await deleteRating({ ratingId: id });
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
