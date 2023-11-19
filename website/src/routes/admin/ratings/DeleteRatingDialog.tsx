import React from "react";
import { gql, useMutation } from "@apollo/client";
import { Dialog } from "../../../components/Dialog";
import { Error } from "../../../components/Error";
import { AlertDialogBody, AlertDialogFooter, Button } from "@chakra-ui/react";
import { DeleteRatingMutation } from "../../../generated/graphql";
import { useNavigate } from "react-router-dom";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  id: string;
}

const DeleteRating = gql`
  mutation DeleteRating($id: String!) {
    deleteRating(id: $id)
  }
`

export function DeleteRatingDialog({ isOpen, onClose, id }: Props) {
  const navigate = useNavigate();
  
  const [deleteRating, { loading, error }] = useMutation<DeleteRatingMutation>(DeleteRating, {
    variables: { id },
    update: (cache) => {
      const cacheId = cache.identify({ __typename: "Rating", id });

      cache.evict({ id: cacheId });
      cache.gc();
    },
  });

  const onDelete = async () => {
    await deleteRating();
    onClose();
    navigate(-1);
  };

  return (
    <Dialog title="Delete Rating?" isOpen={isOpen} onClose={onClose}>
      <AlertDialogBody>
        {error && <Error error={error} />}
        Are you sure you want to delete this rating?
      </AlertDialogBody>
      <AlertDialogFooter>
        <Button onClick={onClose} mr={2}>Cancel</Button> 
        <Button isLoading={loading} onClick={onDelete} colorScheme="red">Delete</Button> 
      </AlertDialogFooter>
    </Dialog>
  );
}