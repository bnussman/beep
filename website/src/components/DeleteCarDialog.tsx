import React, { useState } from "react";
import { RouterOutputs } from "../../../api/src";
import { orpc } from "../utils/orpc";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

type Car = RouterOutputs["car"]["cars"]["cars"][number];

interface Props {
  isOpen: boolean;
  car: Car | undefined;
  onClose: () => void;
}

export function DeleteCarDialog(props: Props) {
  const { isOpen, onClose, car } = props;

  const queryClient = useQueryClient();

  const [reason, setReason] = useState("");

  const { mutate, isPending, error, reset } = useMutation(
    orpc.car.deleteCar.mutationOptions({
      onSuccess() {
        onClose();

        queryClient.invalidateQueries({
          queryKey: orpc.car.cars.key()
        });
      }
    })
  );

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleDelete = () => {
    if (car) {
      mutate({ carId: car.id, reason });
    }
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
        <Button loading={isPending} color="error" onClick={handleDelete}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
