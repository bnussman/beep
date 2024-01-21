import React from "react";
import { useMutation } from "@apollo/client";
import { Dialog } from "../../../components/Dialog";
import { Error } from "../../../components/Error";
import { AlertDialogBody, AlertDialogFooter, Button } from "@chakra-ui/react";
import { graphql } from "gql.tada";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  id: string;
}

const DeleteBeep = graphql(`
  mutation DeleteBeep($id: String!) {
    deleteBeep(id: $id)
  }
`);

export function DeleteBeepDialog({ isOpen, onClose, id }: Props) {
  const [deleteBeep, { loading, error }] = useMutation(DeleteBeep, {
    variables: { id },
    update: (cache) => {
      const cacheId = cache.identify({ __typename: "Beep", id });

      cache.evict({ id: cacheId });
      cache.gc();
    },
  });

  const onDelete = async () => {
    await deleteBeep();
    onClose();
  };

  return (
    <Dialog title="Delete Beep?" isOpen={isOpen} onClose={onClose}>
      <AlertDialogBody>
        {error && <Error error={error} />}
        Are you sure you want to delete this beep?
      </AlertDialogBody>
      <AlertDialogFooter>
        <Button onClick={onClose}>Cancel</Button>
        <Button isLoading={loading} onClick={onDelete} colorScheme="red">Delete</Button>
      </AlertDialogFooter>
    </Dialog>
  );
}
