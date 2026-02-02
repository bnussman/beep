import React from "react";
import { Close } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function SendNotificationConfirmationDialog(props: Props) {
  const { open, onClose, onConfirm } = props;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Send notification?</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <Close />
      </IconButton>
      <DialogContent>
        Are you sure you want to send this notification?
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onConfirm}>
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
}
