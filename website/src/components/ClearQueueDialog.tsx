import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
} from "@mui/material";
import React from "react";

interface Props {
  isOpen: boolean;
  isLoading: boolean;
  cancelRef: any;
  onClose: () => void;
  onSubmit: () => void;
  stopBeeping: boolean;
  setStopBeeping: (beeping: boolean) => void;
}

export function ClearQueueDialog(props: Props) {
  const { isOpen, onClose, isLoading, onSubmit, stopBeeping, setStopBeeping } =
    props;

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Clear user's queue?</DialogTitle>
      <DialogContent>
        <FormControlLabel
          control={<Checkbox />}
          label="Turn off user's Beeping status after clear?"
          checked={stopBeeping}
          onChange={() => setStopBeeping(!stopBeeping)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button loading={isLoading} variant="contained" onClick={onSubmit}>
          Clear Queue
        </Button>
      </DialogActions>
    </Dialog>
  );
}
