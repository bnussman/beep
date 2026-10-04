import React, { useState } from "react";
import { RouterOutputs } from "../../../api/src";
import { orpc } from "../utils/orpc";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { Alert, AlertDialog, Button, Description, Label, TextArea, TextField } from "@heroui/react";

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
    <AlertDialog.Backdrop
      isOpen={isOpen}
      onOpenChange={(open) => !open && handleClose()}
    >
      <AlertDialog.Container>
        <AlertDialog.Dialog>
          <AlertDialog.Header>
            <AlertDialog.Heading>
              Delete {car?.user.first}'s {car?.make} {car?.model}?
            </AlertDialog.Heading>
          </AlertDialog.Header>
          <AlertDialog.Body className="flex flex-col gap-4">
            {error && (
              <Alert status="danger">
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title>{error.message}</Alert.Title>
                </Alert.Content>
              </Alert>
            )}
            <TextField>
              <Label>Notification Message</Label>
              <TextArea
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                rows={3}
              />
              <Description>
                Type a message here if you want the user to receive a notification about why their car was removed.
              </Description>
            </TextField>
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button variant="tertiary" onPress={handleClose}>Cancel</Button>
            <Button isPending={isPending} variant="danger" onPress={handleDelete}>
              Delete
            </Button>
          </AlertDialog.Footer>
        </AlertDialog.Dialog>
      </AlertDialog.Container>
    </AlertDialog.Backdrop>
  );
}
