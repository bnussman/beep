import React from "react";
import { orpc } from "../../../utils/orpc";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import {
  Alert,
  Dialog,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  id: string;
  onSuccess?: () => void;
}

export function DeleteReportDialog({ isOpen, onClose, id, onSuccess }: Props) {
  const queryClient = useQueryClient();

  const {
    mutateAsync: deleteReport,
    isPending,
    error,
  } = useMutation(orpc.report.deleteReport.mutationOptions({
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: orpc.report.reports.key() });
    },
  }));

  const onDelete = async () => {
    await deleteReport(id);
    onClose();

    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Delete report?</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error">{error.message}</Alert>}
        <DialogContentText>
          Are you sure you want to delete this report?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button loading={isPending} onClick={onDelete} color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
