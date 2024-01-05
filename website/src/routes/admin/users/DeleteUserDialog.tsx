import React from "react";
import { Dialog } from "../../../components/Dialog";
import { Error } from "../../../components/Error";
import { AlertDialogBody, AlertDialogFooter, Button } from "@chakra-ui/react";
import { gql, useMutation } from "@apollo/client";
import { RemoveUserMutation } from "../../../generated/graphql";

interface Props {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}


const RemoveUser = gql`
  mutation RemoveUser($id: String!) {
    removeUser(id: $id)
  }
`;

export function DeleteUserDialog({ isOpen, onClose, userId }: Props) {
  const [deleteUser, { loading, error }] = useMutation<RemoveUserMutation>(RemoveUser, {
    variables: { id: userId },
    update: (cache) => {
      const id = cache.identify({ __typename: "User", id: userId });

      cache.evict({ id });
      cache.gc();
    },
  });

  const onDelete = async () => {
    await deleteUser();
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Delete User?"
    >
      <AlertDialogBody>
        {error && <Error error={error} />}
        Are you sure you want to delete user {userId}?
      </AlertDialogBody>
      <AlertDialogFooter>
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button isLoading={loading} colorScheme="red" onClick={onDelete} ml={3}>
          Delete
        </Button>
      </AlertDialogFooter>
    </Dialog>
  );
}
