import React from "react";
import { gql, useMutation } from "@apollo/client";
import { Dialog } from "../../../components/Dialog";
import { Error } from "../../../components/Error";
import { AlertDialogBody, AlertDialogFooter, Button } from "@chakra-ui/react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  id: string;
  onSuccess?: () => void;
}

export const DeleteReport = gql`
  mutation DeleteReport($id: String!) {
    deleteReport(id: $id)
  }
`;

export function DeleteReportDialog({ isOpen, onClose, id, onSuccess }: Props) {
  const [deleteReport, { loading, error }] = useMutation(DeleteReport, {
    variables: { id },
    update: (cache) => {
      const cacheId = cache.identify({ __typename: "Report", id });

      cache.evict({ id: cacheId });
      cache.gc();
    },
  });

  const onDelete = async () => {
    await deleteReport();
    onClose();

    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <Dialog title="Delete Report?" isOpen={isOpen} onClose={onClose}>
      <AlertDialogBody>
        {error && <Error error={error} />}
        Are you sure you want to delete this report?
      </AlertDialogBody>
      <AlertDialogFooter>
        <Button onClick={onClose} mr={2}>Cancel</Button>
        <Button isLoading={loading} onClick={onDelete} colorScheme="red">Delete</Button>
      </AlertDialogFooter>
    </Dialog>
  );
}
