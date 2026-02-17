import React, { useState } from "react";
import { RouterOutput, useTRPC } from "../../../utils/trpc";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  isOpen: boolean;
  car: RouterOutput["car"]["cars"]["cars"][number] | undefined;
  onClose: () => void;
}

export function DeleteCarDialog(props: Props) {
  const trpc = useTRPC();
  const { isOpen, onClose, car } = props;

  const queryClient = useQueryClient();

  const [reason, setReason] = useState("");

  const {
    mutateAsync: deleteCar,
    isPending,
    error,
    reset,
  } = useMutation(trpc.car.deleteCar.mutationOptions());

  const handleClose = () => {
    reset();
    onClose();
  };

  const doDelete = () => {
    deleteCar({ carId: car?.id ?? "", reason }).then(() => {
      onClose();
      queryClient.invalidateQueries(trpc.car.cars.pathFilter());
    });
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle fontSize="lg" fontWeight="bold">
        Delete {car?.user.first}'s {car?.make} {car?.model}?
      </DialogTitle>
      <DialogContent>
        {error && <Alert severity="error">{error.message}</Alert>}
        <TextField
          sx={{ mt: 2 }}
          label="Notification Message"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          helperText="Type a message here if you want the user to recieve a notification about why their car was removed"
          multiline
          rows={3}
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button loading={isPending} color="error" onClick={doDelete}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
