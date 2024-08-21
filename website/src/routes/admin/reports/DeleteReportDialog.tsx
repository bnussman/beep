import React from "react";
import { Dialog } from "../../../components/Dialog";
import { Error } from "../../../components/Error";
import { AlertDialogBody, AlertDialogFooter, Button } from "@chakra-ui/react";
import { trpc } from "../../../utils/trpc";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  id: string;
  onSuccess?: () => void;
}

export function DeleteReportDialog({ isOpen, onClose, id, onSuccess }: Props) {
  const utils = trpc.useUtils();
  const queryClient = useQueryClient();

  const {
    mutateAsync: deleteReport,
    isPending,
    error
  } = trpc.report.deleteReport.useMutation({
    onSuccess() {
      utils.report.reports.invalidate();
    }
  });

  const onDelete = async () => {
    await deleteReport(id);
    onClose();

    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <Dialog title="Delete Report?" isOpen={isOpen} onClose={onClose}>
      <AlertDialogBody>
        {error && <Error>{error.message}</Error>}
        Are you sure you want to delete this report?
      </AlertDialogBody>
      <AlertDialogFooter>
        <Button onClick={onClose} mr={2}>Cancel</Button>
        <Button isLoading={isPending} onClick={onDelete} colorScheme="red">Delete</Button>
      </AlertDialogFooter>
    </Dialog>
  );
}
